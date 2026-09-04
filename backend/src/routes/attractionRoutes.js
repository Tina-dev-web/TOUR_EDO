
const express = require("express");

const {
  createAttraction,
  getAllAttractions,
  getAttractionById,
  updateAttraction,
  deleteAttraction,
  searchAttractions,
  filterAttractions,
} = require("../controllers/attractionControllers");

const protectedAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protectedAuth,
  upload.array("images", 5),
  createAttraction
);

router.get("/", getAllAttractions);

router.get("/search", searchAttractions);

router.get("/filter", filterAttractions);

router.get("/:id", getAttractionById);

router.put("/:id", protectedAuth, upload.array("images", 5), updateAttraction);

router.delete("/:id", protectedAuth, deleteAttraction);

module.exports = router;