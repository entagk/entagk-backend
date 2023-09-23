const mongoose = require('mongoose');
const StickyNote = require('../../models/stickyNote');

const validateContent = (content) => {
  const types = [
    "heading-one",
    "heading-two",
    "block-quote",
    "bulleted-list",
    "numbered-list",
    "list-item",
    "link",
    "paragraph"
  ];

  const styles = [
    "bold",
    "code",
    "italic",
    "underline",
    "subscript",
    "superscript",
    "strikethrough",
  ]

  const validateChildren = (children) => {
    for (const text of children) {
      if (text.type !== 'link') {
        const textStyles = Object.keys(text).filter(s => s !== 'text');
        if (!textStyles.every(sty => styles.includes(sty)))
          return { validContent: false, textLength, invalidChildren: true };
        textLength += text.text?.trim()?.length;
      } else {
        const validLink = validateChildren(text.children);
        textLength += validLink.textLength;
      }
    };
  }

  if (content.length === 0)
    return { validContent: false, textLength: 0 };

  let textLength = 0;
  if (!content instanceof Array) {
    return { validContent: false, textLength: 0 };
  } else {
    for (const row of content) {
      if (!types.includes(row.type) || !row.children) {
        return { validContent: false, textLength, invalidType: true };
      }

      if (row.children.length === 0) {
        return { validContent: false, textLength, invalidChildren: true };
      }

      if (row.type === "numbered-list" || row.type === "bulleted-list") {
        const validList = validateContent(row.children);
        if (!validList.validContent)
          return { validContent: false, textLength, invalidChildren: true };
        else textLength += validList.textLength;
      } else {
        for (const text of row.children) {
          if (text.type !== 'link') {
            const textStyles = Object.keys(text).filter(s => s !== 'text');
            if (!textStyles.every(sty => styles.includes(sty)))
              return { validContent: false, textLength, invalidChildren: true };
            textLength += text.text?.trim()?.length;
          } else {
            textLength += text.children[0].text?.trim()?.length;
          }
        };
      }
    }
  }

  return { validContent: true, textLength };
}

const modifyNote = async (ws, req) => {
  try {
    let note;

    ws.isPaused = false;
    ws.on('message', async function (msg) {
      const msgData = JSON.parse(msg);
      const id = msgData?.id || msgData?._id;

      if (!id) {
        ws.send(JSON.stringify({ message: "The id is required" }));
        ws.close(1007, "The id is required");
        ws.isPaused = true;
      } else if ((!mongoose.Types.ObjectId.isValid(id) && !id.includes('new'))) {
        ws.send(JSON.stringify({ message: "Invalid Id" }));
        ws.close(1007, "Invalid Id");
        ws.isPaused = true;
      }

      note = !id.includes('new') ? await StickyNote.findById(id) : {};

      if (!note?._id && !id.includes('new')) {
        ws.send(JSON.stringify({ message: "Invalid Id" }));
        ws.close(1007, "Invalid Id");
        ws.isPaused = true;
      }

      const validContent = msgData?.content ? validateContent(msgData?.content) : { validateContent: false };

      if (id.includes('new') && (!msgData?.content || !validContent.validContent)) {
        ws.send(JSON.stringify({ message: "invalid note" }));
        ws.isPaused = true;
      }

      // validate note content
      if (msgData?.content && !validContent.validContent) {
        ws.send(JSON.stringify({ message: "invalid content" }));
        ws.isPaused = true;
      }

      // validate coordinates
      if (msgData?.coordinates) {
        const { width, height } = msgData.coordinates;
        if (!width && !height) {
          ws.send(JSON.stringify({ message: "invalid coordinates" }));
          ws.isPaused = true;
        }

        if (width < 100) {
          ws.send(JSON.stringify({ message: "invalid width" }));
          ws.isPaused = true;
        }

        if (height < 100) {
          ws.send(JSON.stringify({ message: "invalid height" }));
          ws.isPaused = true;
        }

        msgData.coordinates = { ...note?.coordinates, ...msgData.coordinates };
      }

      if (msgData?.color && typeof msgData.color !== 'string') {
        ws.send(JSON.stringify({ message: "invalid color" }));
        ws.isPaused = true;
      }

      if (msgData?.open && typeof msgData?.open !== 'boolean') {
        ws.send(JSON.stringify({ message: "invalid open" }));
        ws.isPaused = true;
      }

      if (!ws.isPaused) {
        if (msgData.content) {
          msgData.contentLength = {
            textLength: validContent.textLength,
            arrayLength: msgData.content.length
          }
        }

        delete msgData?.id;
        delete msgData?._id;

        const updatedNote =
          id.includes('new') ?
            await StickyNote.create({
              ...msgData,
              userId: req.user._id,
            }) :
            await StickyNote.findByIdAndUpdate(
              note?._id,
              msgData,
              { new: true }
            );

        ws.send(JSON.stringify({ ...updatedNote?._doc, oldId: !id.includes('new') ? id : id }));
      }
    });
  } catch (error) {
    console.log(error);
    ws.send(JSON.stringify(error));
    ws.close(1011, error.message);
  }
};

module.exports = modifyNote;
