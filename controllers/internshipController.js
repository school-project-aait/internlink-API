const Internship = require('../models/Internship');

exports.createInternship = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const created_by = req.user.id; // This comes from your authenticate middleware
    
    const { title, description, deadline, company_id, category_id } = req.body;
    
    // Basic validation
    if (!title || !company_id || !category_id || !deadline) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, company, category, and deadline are required' 
      });
    }
    
    const internshipData = {
      title,
      description: description || '',
      deadline,
      company_id,
      category_id,
      created_by // Add the user ID here
    };
    
    const internshipId = await Internship.createInternship(internshipData);
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
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verify internship exists and belongs to the admin
    const existingInternship = await Internship.getInternshipById(id);
    if (!existingInternship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (existingInternship.created_by !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this internship' });
    }

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

    // Verify internship exists and belongs to the admin
    const existingInternship = await Internship.getInternshipById(id);
    if (!existingInternship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Internship not found' 
      });
    }

    if (existingInternship.created_by !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this internship' 
      });
    }

    const isDeleted = await Internship.deleteInternship(id);
    
    if (!isDeleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to delete internship' 
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