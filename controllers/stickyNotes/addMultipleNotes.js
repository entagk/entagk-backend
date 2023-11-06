const StickyNotes = require('../../models/stickyNote');
const { validateNoteContent } = require('../../utils/helper');

const addMultipleNotes = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ message: "The data have been sent is not array, please try again" });
    if (req.body?.length === 0) return res.status(400).json({ message: 'No data have been sent yet.' });

    const notes = req.body.map((note) => {
      return { ...note, userId: req.user._id.toString() };
    });

    const colors = ["pink", "yellow", "orange", "green", "blue"];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      delete note._id;
      delete note.id;
      const { color, open, updatedAt, content, coordinates, position } = note;
      if (typeof color !== 'string' || !colors.includes(color)) {
        res.status(400).json({ message: `For note ${i + 1}, invalid color` });
      }

      if (typeof open !== 'boolean') {
        res.status(400).json({ message: `For note ${i + 1}, invalid open` });
      }

      if (!(new Date(updatedAt) instanceof Date) || new Date(updatedAt).toJSON() !== updatedAt) {
        res.status(400).json({ message: `For note ${i + 1}, invalid updatedAt date` });
      }

      const validContent = content ? validateNoteContent(content) : { validateContent: false };

      if (!validContent.validContent) {
        res.status(400).json({ message: `For note ${i + 1}, invalid content` });
      }

      const { width, height } = coordinates;
      if (!width && !height) {
        res.status(400).json({ message: `For note ${i + 1}, invalid coordinates` });
      }

      if (width < 100) {
        res.status(400).json({ message: `For note ${i + 1}, invalid width` });
      }

      if (height < 100) {
        res.status(400).json({ message: `For note ${i + 1}, invalid height` });
      }

      const { top, left } = position;
      if (!("top" in position) || !("left" in position))
        res.status(400).json({ message: `For note ${i + 1}, invalid posstion` });

      if (typeof top !== 'number' || typeof left !== 'number')
        res.status(400).json({ message: `For note ${i + 1}, invalid posstion` });

      note.contentLength = {
        textLength: validContent.textLength,
        arrayLength: content.length
      }
    }

    const notesData = await StickyNotes.insertMany(notes);

    res.status(200).json(notesData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.messsage });
  }
}

module.exports = addMultipleNotes;
