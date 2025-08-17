import { Company } from "../models/company.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register the same company.",
        success: false
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false
    });
  }
};

// Get all companies of logged-in user
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false
      });
    }

    return res.status(200).json({
      companies,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false
    });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false
      });
    }

    return res.status(200).json({
      company,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false
    });
  }
};

// Update company details
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    let logo;

    // Upload logo only if file is provided
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    // Dynamically build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (location) updateData.location = location;
    if (logo) updateData.logo = logo;

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false
      });
    }

    return res.status(200).json({
      message: "Company information updated.",
      company,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false
    });
  }
};