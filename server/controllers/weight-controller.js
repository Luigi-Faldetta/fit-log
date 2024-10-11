const { Weight } = require('../models/weight-model');

exports.getWeightData = async (req, res) => {
  try {
    const weightData = await Weight.findAll();
    res.json(weightData);
  } catch (error) {
    console.error('Failed to get weight data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createWeightEntry = async (req, res) => {
  try {
    const { value, date } = req.body;
    const newWeightEntry = await Weight.create({ value, date });
    res.status(201).json(newWeightEntry);
  } catch (error) {
    console.error('Failed to create weight entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteWeightEntry = async (req, res) => {
  try {
    const { weightId } = req.params;
    const weightEntry = await Weight.findByPk(weightId);

    if (!weightEntry) {
      return res.status(404).json({ error: 'Weight entry not found' });
    }

    await weightEntry.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete weight entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
