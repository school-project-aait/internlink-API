const Internship = require('../models/internshipModel');

exports.createInternship = async (req, res) => {
  try {
    const result = await Internship.createInternship(req.body);
    res.status(201).json({ message: "Internship created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.getAllInternships();
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.getInternshipById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    await Internship.updateInternship(req.params.id, req.body);
    res.status(200).json({ message: "Internship updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    await Internship.deleteInternship(req.params.id);
    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
