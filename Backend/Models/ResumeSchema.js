import { Schema, model } from "mongoose";
const ResumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    publicId: String,
    fileUrl: String,
    fileName: String,
    jobTitle: String,
    atsScore: Number,
    improvements: [
      {
        heading: String,
        content: String,
      },
    ],
    pros: [String],
    cons: [String],
    graph: Object,
    optimizedResume: {
      personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
      },

      summary: String,

      skills: [
        {
          category: String,
          items: [String],
        },
      ],

      projects: [
        {
          title: String,
          link: String,
          description: [String],
          technologies: [String],
        },
      ],

      experience: [
        {
          role: String,
          company: String,
          duration: String,
          description: [String],
        },
      ],

      education: [
        {
          degree: String,
          institution: String,
          university: String,
          years: String,
          dates: String,
          details: [String],
          gpa: String,
        },
      ],

      certifications: [
        {
          name: String,
          issuer: String,
        },
      ],

      achievements: [
        {
          name: String,
          title: String,
          details: String,
        },
      ],
    },
    optimizedFileUrl: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);
export const ResumeModel = new model("resume", ResumeSchema);
