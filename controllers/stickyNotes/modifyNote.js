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

  if (content.length === 0) return false;

  let invalidText = true,
    textLength = 0;
  if (!content instanceof Array) {
    return false;
  } else {
    for (const row of content) {
      if (!types.includes(row.type) || !row.children) {
        return false;
      }

      if (row.children.length === 0 || (row.children.length === 1 && row.children[0].text.trim().length === 0)) {
        return false;
      }

      if (row.type === "numbered-list" || row.type === "bulleted-list") {
        if (!validateContent(row.children)) return false;
      } else {
        for (const text of row.children) {
          if (!text.text) return false;
          const textStyles = Object.keys(text).filter(s => s !== 'text');
          if (!textStyles.every(sty => styles.includes(sty))) return false;
          textLength += text.text.trim().length;
        };
      }
    }
  }

  if (invalidText && !textLength) return false;
  else return true;
}

const modifyNote = async (ws, req) => {
  const { id } = req.params;

  ws.isPaused = false;

  if (!id) {
    ws.send("The id is required");
    ws.close(1007, "The id is required");
    ws.isPaused = true;
  } else if ((!mongoose.Types.ObjectId.isValid(id) && id !== 'new')) {
    ws.send("Invalid Id");
    ws.close(1007, "Invalid Id");
    ws.isPaused = true;
  }

  const note = id !== 'new' ? await StickyNote.findById(id) : {};

  if (!note?._id && id !== 'new') {
    ws.send("Invalid Id");
    ws.close(1007, "Invalid Id");
    ws.isPaused = true;
  }

  ws.on('message', async function (msg) {
    const msgData = JSON.parse(msg);

    // validate note content
    if (msgData?.content && !validateContent(msgData?.content)) {
      ws.send('invalid content');
      ws.close(1007, 'invalid content');
      ws.isPaused = true;
    }

    // validate coordinates
    if (msgData?.coordinates) {
      const { width, height } = msgData.coordinates;
      if (!width && !height) {
        ws.send("invalid coordinates");
        ws.close(1007, 'invalid coordinates');
        ws.isPaused = true;
      }

      if (width < 100) {
        ws.send("invalid width");
        ws.close(1007, 'invalid width');
        ws.isPaused = true;
      }

      if (height < 100) {
        ws.send("invalid height");
        ws.close(1007, 'invalid height');
        ws.isPaused = true;
      }

      msgData.coordinates = { ...note.coordinates, ...msgData.coordinates };
    }

    if (msgData?.color && typeof msgData.color !== 'string') {
      ws.send('invalid color');
      ws.close(1007, 'invalid color');
      ws.isPaused = true;
    }

    if (msgData?.open && typeof msgData?.open !== 'boolean') {
      ws.send('invalid open');
      ws.close(1007, 'invalid open');
      ws.isPaused = true;
    }

    if (!ws.isPaused) {
      const updatedNote =
        id === 'new' ?
          await StickyNote.create({ ...msgData, userId: req.user._id }) :
          await StickyNote.findByIdAndUpdate(note._id, msgData, { new: true });

      ws.send(JSON.stringify(updatedNote));
    }
  });
};

module.exports = modifyNote;
