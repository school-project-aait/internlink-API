const Application = require("../models/Application");

// Apply to an internship
exports.applyToInternship = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      internship_id,
      university,
      degree,
      graduation_year,
      linkdIn,
      resume_id,
    } = req.body;

    // ✅ Check if the deadline has passed
    const internship = await Application.getInternshipById(internship_id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    if (new Date() > new Date(internship.deadline)) {
      return res.status(400).json({ error: "Application deadline has passed" });
    }

    const applicationData = {
      user_id: userId,
      internship_id,
      university,
      degree,
      graduation_year,
      linkdIn,
      resume_id,
    };

    const applicationId = await Application.createApplication(applicationData);
    res.status(201).json({ message: "Application submitted", applicationId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View logged-in user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.getApplicationsByUser(userId);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an application (by student)
exports.updateApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.id;
    const updateFields = req.body;

    const app = await Application.findApplicationById(applicationId);
    if (!app || app.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Application.updateApplication(applicationId, updateFields);
    res.json({ message: "Application updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Withdraw an application (delete)
// Withdraw an application (delete)
exports.withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userId = req.user.id;

    const app = await Application.findApplicationById(applicationId);
    if (!app || app.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // ✅ Check if the internship deadline has passed
    const internship = await Application.getInternshipById(app.internship_id);
    if (new Date() > new Date(internship.deadline)) {
      return res.status(400).json({ error: "Cannot withdraw after the deadline" });
    }

    await Application.deleteApplication(applicationId, userId);
    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Change status (by admin)
exports.changeApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    if(!applicationId){
        return res.status(400).json({error:"application not found"})
    }

    await Application.updateStatus(applicationId, status);
    res.json({ message: "Application status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
