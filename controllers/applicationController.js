const applicationModel = require('../models/applicationModel');
const { validateApplication } = require('../middlewares/validations');
const path = require('path');
const db = require('../config/db'); // Adjust path based on your project structure


exports.createApplication = async (req, res) => {
  try {
    const { internship_id, university, degree, graduation_year, linkdIn } = req.body;

    // ✅ Check if a resume file was uploaded
    if (!req.file) {
      return res.status(400).json({ errors: { resume: 'Resume file is required' } });
    }

    // ✅ Save resume metadata into resumes table
    const resumePath = req.file.path;
    const resumeName = req.file.filename;

    const resume_id = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO resume (user_id, orginal_filename, file_extension, attachment_path) VALUES (?, ?, ?, ?)',
        [req.user.id, resumeName, path.extname(req.file.originalname), resumePath],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
    

    // ✅ Validate application fields (excluding resume_id)
    const errors = validateApplication({
      internship_id,
      university,
      degree,
      graduation_year,
      linkdIn
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // ✅ Check for duplicate application
    const alreadyApplied = await applicationModel.checkExistingApplication(
      req.user.id,
      internship_id
    );
    if (alreadyApplied) {
      return res.status(409).json({ error: "You've already applied to this internship" });
    }

    // ✅ Create application with the generated resume_id
    const applicationId = await applicationModel.createApplication({
      user_id: req.user.id,
      internship_id,
      university,
      degree,
      graduation_year,
      linkdIn,
      resume_id // ✅ Now properly defined
    });

    res.status(201).json({
      success: true,
      applicationId,
      message: "Application submitted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
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
  } catch (error) {
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
},

exports.getSingleApplication = async (req, res) => {
  const { id } = req.params; // application ID
  try {
    const application = await applicationModel.getApplicationByIdAndUser(id, req.user.id);
    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// meron's
// Change status (by admin)
exports.changeApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {}; // ⚠️ This line throws error if req.body is undefined

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    await applicationModel.updateStatus(id, status);

    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await applicationModel.getAllApplications();
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



// exports.changeApplicationStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const applicationId = req.params.id;

//     const validStatuses = ["pending", "accepted", "rejected"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: "Invalid status value" });
//     }
//     if(!applicationId){
//         return res.status(400).json({error:"application not found"})
//     }

//     await Application.updateStatus(applicationId, status);
//     res.json({ message: "Application status updated successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
