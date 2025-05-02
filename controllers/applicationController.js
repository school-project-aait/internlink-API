const applicationModel = require('../models/applicationModel');
const { validateApplication } = require('../middlewares/validations');

exports.createApplication = async (req, res) => {
  try {
    const { 
      internship_id, 
      university, 
      degree, 
      graduation_year, 
      linkdIn, 
      resume_id 
    } = req.body;

    // Validate fields
    const errors = validateApplication(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Check for duplicate application
    const alreadyApplied = await applicationModel.checkExistingApplication(
      req.user.id, 
      internship_id
    );
    if (alreadyApplied) {
      return res.status(409).json({ 
        error: "You've already applied to this internship" 
      });
    }

    const applicationId = await applicationModel.createApplication({
      user_id: req.user.id,
      internship_id,
      university,
      degree,
      graduation_year,
      linkdIn,
      resume_id
    });

    res.status(201).json({
      success: true,
      applicationId,
      message: "Application submitted successfully"
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await applicationModel.getApplicationsByUser(req.user.id);
    res.json({ 
      success: true,
      data: applications 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const isUpdated = await applicationModel.updateApplication(
      id,
      req.user.id,
      updates
    );

    if (!isUpdated) {
      return res.status(404).json({ 
        success: false,
        error: "Application not found or unauthorized" 
      });
    }

    res.json({ 
      success: true,
      message: "Application updated successfully" 
    });
  }  catch (error) {
    // Handle deadline error specifically
    if (error.message.includes("deadline")) {
      return res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const isDeleted = await applicationModel.deleteApplication(id, req.user.id);
    
    if (!isDeleted) {
      return res.status(404).json({ 
        success: false,
        error: "Application not found or unauthorized" 
      });
    }

    res.json({ 
      success: true,
      message: "Application deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};