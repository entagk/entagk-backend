const mongoose = require('mongoose');
const StickyNote = require('../../models/stickyNote');
const { validateNoteContent } = require('../../utils/helper');

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

      const validContent = msgData?.content ? validateNoteContent(msgData?.content) : { validateContent: false };

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

      const colors = ["pink", "yellow", "orange", "green", "blue"];

      if (msgData?.color && (typeof msgData.color !== 'string' || !colors.includes(msgData.color))) {
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
