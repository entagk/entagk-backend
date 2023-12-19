const mongoose = require('mongoose');
const StickyNote = require('../../models/stickyNote');
const { validateNoteContent } = require('../../utils/helper');

const modifyNote = async (ws, req) => {
  try {
    let note;

    ws.isPaused = false;
    ws.on('message', async function (msg) {
      const msgData = JSON.parse(msg);
      const action = msgData?.action;
      const data = msgData.data;
      const id = data?.id || data?._id;

      if (!id) {
        ws.send(JSON.stringify({ message: "The id is required", action, success: false }));
        ws.close(1007, "The id is required");
        ws.isPaused = true;
      } else if ((!mongoose.Types.ObjectId.isValid(id) && !id.includes('new'))) {
        ws.send(JSON.stringify({ message: "Invalid Id", action, success: false }));
        ws.close(1007, "Invalid Id");
        ws.isPaused = true;
      }

      note = !id.includes('new') ? await StickyNote.findById(id) : {};

      if (!note?._id && !id.includes('new')) {
        ws.send(JSON.stringify({ message: "Invalid Id", action, success: false }));
        ws.close(1007, "Invalid Id");
        ws.isPaused = true;
      }

      const validContent = data?.content ? validateNoteContent(data?.content) : { validateContent: false };

      if (id.includes('new') && (!data?.content || !validContent.validContent)) {
        ws.send(JSON.stringify({ message: "invalid note", id, action, success: false }));
        ws.isPaused = true;
      }

      // validate note content
      if (data?.content && !validContent.validContent) {
        ws.send(JSON.stringify({ message: "invalid content", id, action, success: false }));
        ws.isPaused = true;
      }

      // validate coordinates
      if (data?.coordinates) {
        const { width, height } = data.coordinates;
        if (!width && !height) {
          ws.send(JSON.stringify({ message: "invalid coordinates", id, action, success: false }));
          ws.isPaused = true;
        }

        if (width < 100) {
          ws.send(JSON.stringify({ message: "invalid width", id, action, success: false }));
          ws.isPaused = true;
        }

        if (height < 100) {
          ws.send(JSON.stringify({ message: "invalid height", id, action, success: false }));
          ws.isPaused = true;
        }

        data.coordinates = { ...note?.coordinates, ...data.coordinates };
      }

      const colors = ["pink", "yellow", "orange", "green", "blue"];

      if (data?.color && (typeof data.color !== 'string' || !colors.includes(data.color))) {
        ws.send(JSON.stringify({ message: "invalid color", id, action, success: false }));
        ws.isPaused = true;
      }

      if (data?.open && typeof data?.open !== 'boolean') {
        ws.send(JSON.stringify({ message: "invalid open", id, action, success: false }));
        ws.isPaused = true;
      }

      if (!ws.isPaused) {
        if (data.content) {
          data.contentLength = {
            textLength: validContent.textLength,
            arrayLength: data.content.length
          }
        }

        delete data?.id;
        delete data?._id;

        const updatedNote =
          id.includes('new') ?
            await StickyNote.create({
              ...data,
              userId: req.user._id,
            }) :
            await StickyNote.findByIdAndUpdate(
              note?._id,
              data,
              { new: true }
            );

        const finalData = { id, action, success: true };

        if (action === 'add' || action === 'edit') {
          finalData.data = updatedNote;
          if (action === 'add') {
            finalData.oldId = !id.includes('new') ? id : id
          }
        }

        console.log(finalData);

        ws.send(JSON.stringify(finalData));
      }
    });
  } catch (error) {
    console.log(error);
    ws.send(JSON.stringify(error));
    ws.close(1011, error.message);
  }
};

module.exports = modifyNote;
