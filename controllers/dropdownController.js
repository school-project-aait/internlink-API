const Category = require('../models/Category');
const Company = require('../models/company');

exports.getDropdownData = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    const companies = await Company.getAllCompanies();
    
    res.json({
      success: true,
      data: {
        categories,
        companies
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCompaniesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const companies = await Company.getCompaniesByCategory(categoryId);
    
    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};