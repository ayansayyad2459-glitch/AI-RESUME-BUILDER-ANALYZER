const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    rawText: {
      type: String,
      default: '',
    },
    analysis: {
      overallScore: { type: Number, default: 0 },
      skills: [String],
      experience: {
        years: { type: Number, default: 0 },
        level: { type: String, default: 'Entry Level' },
      },
      education: [String],
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      keywords: [String],
      categoryMatch: {
        type: String,
        default: 'General',
      },
    },
    jobSuggestions: [
      {
        title: String,
        company: String,
        location: String,
        platform: String,
        url: String,
        matchScore: Number,
      },
    ],
    createdResume: {
      personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        portfolio: String,
        summary: String,
      },
      experience: [
        {
          title: String,
          company: String,
          location: String,
          startDate: String,
          endDate: String,
          current: Boolean,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          location: String,
          startDate: String,
          endDate: String,
          gpa: String,
        },
      ],
      skills: [String],
      certifications: [
        {
          name: String,
          issuer: String,
          date: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: String,
          link: String,
        },
      ],
      template: {
        type: String,
        default: 'modern',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
