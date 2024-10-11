const { BodyFat } = require('../models/bodyfat-model');

exports.getBodyFatData = async (req, res) => {
  try {
    const bodyFatData = await BodyFat.findAll();
    res.json(bodyFatData);
  } catch (error) {
    console.error('Failed to get body fat data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createBodyFatEntry = async (req, res) => {
  try {
    const { value, date } = req.body;
    const newBodyFatEntry = await BodyFat.create({ value, date });
    res.status(201).json(newBodyFatEntry);
  } catch (error) {
    console.error('Failed to create body fat entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteBodyFatEntry = async (req, res) => {
  try {
    const { bodyFatId } = req.params;
    const bodyFatEntry = await BodyFat.findByPk(bodyFatId);

    if (!bodyFatEntry) {
      return res.status(404).json({ error: 'Body fat entry not found' });
    }

    await bodyFatEntry.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete body fat entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
