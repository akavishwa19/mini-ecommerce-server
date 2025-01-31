import { uploadMedia } from "../Controllers/upload.cotroller.js";
import multer from "multer";

import { Router } from "express";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});

const upload = multer({ storage: storage });

router.post("/upload-media", upload.single("file"), uploadMedia);

export default router;
