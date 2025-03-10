const Script = require('../models/Script');

exports.createScript = async (req, res) => {
  try {
    const { title, content } = req.body;
    const script = new Script({
      title,
      content,
      user: req.userId,
    });
    await script.save();
    res.status(201).json(script);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getScripts = async (req, res) => {
  try {
    const scripts = await Script.find({ user: req.userId });
    res.json(scripts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateScript = async (req, res) => {
  try {
    const script = await Script.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    res.json(script);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteScript = async (req, res) => {
  try {
    const scriptId = req.params.id;
    

    const script = await Script.findOneAndDelete({ 
      _id: scriptId, 
      user: req.userId 
    });

    if (!script) {
      return res.status(404).json({ 
        message: 'Script not found or you do not have permission to delete it' 
      });
    }

    res.json({ 
      message: 'Script deleted successfully',
      deletedScript: script 
    });
  } catch (error) {
    console.error('Delete Script Error:', error);
    
    res.status(500).json({ 
      message: 'Error deleting script',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
};