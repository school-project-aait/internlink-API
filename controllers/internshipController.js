const Internship = require('../models/Internship'); 
exports.createInternship = async (req, res) => {
  try {
    const created_by = req.user.id;
    const { title, description, deadline, company_name, category_id } = req.body;
    
    if (!title || !company_name || !category_id || !deadline) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, company name, category, and deadline are required' 
      });
    }

    const internshipId = await Internship.createInternship({
      title,
      description,
      deadline,
      company_name,
      category_id,
      created_by
    });

    const newInternship = await Internship.getInternshipById(internshipId);
    
    res.status(201).json({
      success: true,
      data: newInternship,
      message: 'Internship created successfully'
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.getAllInternships();
    res.json({
      success: true,
      data: internships
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await Internship.getInternshipById(id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error fetching internship by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const isUpdated = await Internship.updateInternship(id, updateData);
    
    if (!isUpdated) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const updatedInternship = await Internship.getInternshipById(id);
    
    res.json({
      success: true,
      data: updatedInternship,
      message: 'Internship updated successfully'
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const isDeleted = await Internship.deleteInternship(id);
    
    if (!isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Internship not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};