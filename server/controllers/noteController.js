const Note = require('../models/Note');

const getNotes = async (req, res) => {
    const notes = await Note.find({ user: req.user });
    res.json(notes);
};

const createNote = async (req, res) => {
    const { title, content, tags } = req.body;

    const note = await Note.create({
        user: req.user,
        title,
        content,
        tags,
    });

    res.status(201).json(note);
};

const updateNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note || note.user.toString() !== req.user) {
        return res.status(404).json({ message: 'Note not found' });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
};

// Delete note
const deleteNote = async (req, res) => {
    try { 
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Delete Note Error:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message,
        });
    }
};



module.exports = { getNotes, createNote, updateNote, deleteNote };
