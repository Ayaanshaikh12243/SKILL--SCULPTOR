import express from "express";
import multer from "multer";
import { createRequire } from "module";
import Tesseract from "tesseract.js";
import passport from "passport";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and images are allowed.'));
        }
    }
});

// Extract text from PDF
router.post("/extract-pdf", passport.authenticate("jwt", { session: false }), upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const data = await pdfParse(req.file.buffer);
        res.json({
            text: data.text,
            pages: data.numpages,
            info: data.info
        });
    } catch (error) {
        console.error("PDF extraction error:", error);
        res.status(500).json({ error: "Failed to extract text from PDF" });
    }
});

// Extract text from image (OCR)
router.post("/extract-image", passport.authenticate("jwt", { session: false }), upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng', {
            logger: info => console.log(info)
        });

        res.json({ text });
    } catch (error) {
        console.error("OCR extraction error:", error);
        res.status(500).json({ error: "Failed to extract text from image" });
    }
});

// Auto-detect file type and extract
router.post("/extract", passport.authenticate("jwt", { session: false }), upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        let text = "";

        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            text = data.text;
        } else if (req.file.mimetype.startsWith('image/')) {
            const { data: { text: ocrText } } = await Tesseract.recognize(req.file.buffer, 'eng');
            text = ocrText;
        } else {
            return res.status(400).json({ error: "Unsupported file type" });
        }

        res.json({ 
            text,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error) {
        console.error("Text extraction error:", error);
        res.status(500).json({ error: "Failed to extract text from file" });
    }
});

export default router;
