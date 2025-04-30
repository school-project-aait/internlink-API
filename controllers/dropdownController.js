const Category = require('../models/Category');

exports.getDropdownData = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    
    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// You can remove getCompaniesByCategory since it won't be needed