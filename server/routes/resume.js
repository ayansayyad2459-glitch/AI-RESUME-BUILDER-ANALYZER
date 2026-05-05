const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const { analyzeResume } = require('../utils/analyzeResume');
const router = express.Router();

// Multer config - store in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  },
});

// Upload & Analyze Resume
router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a PDF file' });
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;
    if (!rawText || rawText.trim().length < 10) {
      return res.status(400).json({ message: 'Could not extract text. Please upload a text-based PDF.' });
    }
    const analysisResult = analyzeResume(rawText);
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      rawText,
      analysis: {
        overallScore: analysisResult.overallScore,
        skills: analysisResult.skills,
        experience: analysisResult.experience,
        education: analysisResult.education,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        suggestions: analysisResult.suggestions,
        keywords: analysisResult.keywords,
        categoryMatch: analysisResult.categoryMatch,
      },
      jobSuggestions: analysisResult.jobSuggestions,
    });
    res.status(201).json(resume);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ message: error.message || 'Error analyzing resume' });
  }
});

// Get all resumes for user
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes' });
  }
});

// Get single resume
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume' });
  }
});

// Save created resume
router.post('/create', protect, async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user._id,
      fileName: `${req.body.personalInfo?.fullName || 'Resume'}_resume.pdf`,
      createdResume: req.body,
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error saving resume' });
  }
});

// Delete resume
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

module.exports = router;
