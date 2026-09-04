const Attraction = require("../models/attraction");
const cloudinary = require("../config/cloudinary");

const createAttraction = async (req, res) => {
try {
const {
name,
description,
location,
openingHours,
price,
category,
    } = req.body;
const images = [];

if (req.files && req.files.length > 0) {
for (const file of req.files) {
const result = await new Promise((resolve, reject) => {
const uploadStream = cloudinary.uploader.upload_stream(
  {
    folder: "tour-edo/attractions",
  },
  (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  }
);

          uploadStream.end(file.buffer);
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    const attraction = await Attraction.create({
      name,
      description,
      location,
      images: images,
      openingHours,
      price,
      category,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: "Attraction created successfully",
      attraction,
    });
  } catch (error) {
    console.error("Create attraction error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllAttractions = async (req, res) => {
  try {
    const attractions = await Attraction.find();

    res.status(200).json({
      message: "Attractions retrieved successfully",
      attractions,
    });
  } catch (error) {
    console.error("Get attractions error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getAttractionById = async (req, res) => {
  try {
    const { id } = req.params;

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return res.status(404).json({
        message: "Attraction not found",
      });
    }

    res.status(200).json({
      message: "Attraction retrieved successfully",
      attraction,
    });
  } catch (error) {
    console.error("Get attraction error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

    const updateAttraction = async (req, res) => {
    try {
    const { id } = req.params;

    const {
    name,
    description,
    location,
    openingHours,
    price,
    category,
    } = req.body;

    const attraction = await Attraction.findById(id);

    if (!attraction) {
    return res.status(404).json({
    message: "Attraction not found",
    });
    }

    if (name !== undefined) {
    attraction.name = name;
    }

    if (description !== undefined) {
    attraction.description = description;
    }

    if (location !== undefined) {
    attraction.location = location;
    }

    if (openingHours !== undefined) {
    attraction.openingHours = openingHours;
    }

    if (price !== undefined) {
    attraction.price = price;
    }

    if (category !== undefined) {
    attraction.category = category;
    }


    if (req.files && req.files.length > 0) {

    if (attraction.images && attraction.images.length > 0) {
    for (const image of attraction.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
    }


    const newImages = [];

    for (const file of req.files) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tour-edo/attractions",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(file.buffer);
    });

    newImages.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
    }

    attraction.images = newImages;
    }

    await attraction.save();

    res.status(200).json({
    message: "Attraction updated successfully",
    attraction,
    });
    } catch (error) {
    console.error("Update attraction error:", error);

    res.status(500).json({
    message: "Server error",
    });
    }
    };

const deleteAttraction = async (req, res) => {
  try {
    const { id } = req.params;

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return res.status(404).json({
        message: "Attraction not found",
      });
    }

    
    if (attraction.images && attraction.images.length > 0) {
      for (const image of attraction.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

  
    await Attraction.findByIdAndDelete(id);

    res.status(200).json({
      message: "Attraction deleted successfully",
    });
  } catch (error) {
    console.error("Delete attraction error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const searchAttractions = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.trim() === "") {
      return res.status(400).json({
        message: "Search term is required",
      });
    }

    const attractions = await Attraction.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });

    if (attractions.length === 0) {
      return res.status(404).json({
        message: "No attractions found",
      });
    }

    res.status(200).json({
      message: "Attractions retrieved successfully",
      attractions,
    });
  } catch (error) {
    console.error("Search attractions error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const filterAttractions = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category || category.trim() === "") {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    const attractions = await Attraction.find({
      category: { $regex: category, $options: "i" },
    });

    if (attractions.length === 0) {
      return res.status(404).json({
        message: "No attractions found for this category",
      });
    }

    res.status(200).json({
      message: "Filtered attractions retrieved successfully",
      attractions,
    });
  } catch (error) {
    console.error("Filter attractions error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createAttraction,
  getAllAttractions,
  getAttractionById,
  updateAttraction,
  deleteAttraction,
  searchAttractions,
  filterAttractions,

};