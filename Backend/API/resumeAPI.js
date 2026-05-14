import exp from "express";
import streamifier from "streamifier";
import PDFDocument from "pdfkit";
import fs from "fs";
import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeModel } from "../Models/ResumeSchema.js";
import cloudinary from "../config/cloudinary.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../config/multer.js";
import mongoose from "mongoose";

const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

export const resumeApp = exp.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================= UPLOAD RESUME =================
console.log(01);
resumeApp.post(
  "/upload",
  verifyToken("USER"),
  upload.single("resume"),
  async (req, res) => {
    try {
      // ================= CHECK FILE =================

      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      // ================= JOB TITLE =================

      const jobTitle = req.body.jobTitle || "Software Developer";

      // ================= UPLOAD ORIGINAL PDF =================
      console.log("STEP 1");
      const resultpdf = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
            format: "pdf",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      // ================= EXTRACT TEXT FROM PDF =================

      const pdfData = await pdfParse(req.file.buffer);

      const resumeText = pdfData.text.slice(0, 12000);

      // ================= GEMINI =================

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
Analyze this resume for ATS optimization for the role "${jobTitle}".

Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanation text.
Do NOT use null values.
Do NOT return additional fields.

STRICT JSON FORMAT:

{
  "ats_score": number,

  "pros": [
    "string"
  ],

  "cons": [
    "string"
  ],

  "improvements": [
    {
      "heading": "string",
      "content": "string"
    }
  ],

  "skills_analysis": [
    {
      "skill": "string",
      "score": number
    }
  ],

  "optimized_resume": {

    "personalInfo": {
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "location": "string"
    },

    "summary": "string",

    "skills": [
      {
        "category": "string",
        "items": ["string"]
      }
    ],

    "projects": [
      {
        "title": "string",
        "link": "string",
        "description": ["string"],
        "technologies": ["string"]
      }
    ],

    "experience": [
      {
        "role": "string",
        "company": "string",
        "duration": "string",
        "description": ["string"]
      }
    ],

    "education": [
      {
        "degree": "string",
        "institution": "string",
        "university": "string",
        "years": "string",
        "dates": "string",
        "details": ["string"],
        "gpa": "string"
      }
    ],

    "certifications": [
      {
        "name": "string",
        "issuer": "string"
      }
    ],

    "achievements": [
      {
        "name": "string",
        "title": "string",
        "details": "string"
      }
    ]
  }
}

IMPORTANT RULES:

1. improvements MUST be objects with:
   - heading
   - content

2. skills MUST be array of objects.

3. projects.description MUST be array of strings.

4. projects.technologies MUST be array of strings.

5. experience.description MUST be array of strings.

6. education.details MUST be array of strings.

7. certifications MUST be array of objects.

8. achievements MUST be array of objects.

9. Do NOT generate fields like:
   - linkedin
   - githubLink
   - date
   - url
   - tools
   - techStack

10. Use ONLY fields defined in the schema.

11. If data is unavailable return:
   - empty string ""
   - empty array []

12. skills_analysis MUST contain ONLY the top 5 most important skills
    relevant to the job role.

13. score must be between 1 and 100.

14. Return skills in descending order of score.

Resume:
${resumeText}
`;
      console.log("STEP 2");
      const result = await model.generateContent(prompt);

      const text = result.response.text();

      // ================= CLEAN JSON =================

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed = {};

      try {
        parsed = JSON.parse(cleanText);
      } catch (err) {
        console.log("JSON Parse Error:", err);

        parsed = {
          ats_score: 0,
          pros: [],
          cons: [],
          improvements: [],
          skills_analysis: [],
          optimized_resume: {},
        };
      }

      // ================= OPTIMIZED RESUME DATA =================

      const data = parsed.optimized_resume || {};

      // ================= NORMALIZE EDUCATION =================

      if (!Array.isArray(data.education)) {
        data.education = data.education
          ? [
              {
                degree: data.education.degree || "",
                institution: data.education.institution || "",
                years: data.education.years || data.education.year || "",
                gpa: data.education.gpa || data.education.details || "",
              },
            ]
          : [];
      }

      // ================= NORMALIZE PROJECTS =================

      if (!Array.isArray(data.projects)) {
        data.projects = data.projects ? [data.projects] : [];
      }

      // ================= NORMALIZE EXPERIENCE =================

      if (!Array.isArray(data.experience)) {
        data.experience = data.experience ? [data.experience] : [];
      }

      // ================= NORMALIZE SKILLS =================

      if (!Array.isArray(data.skills)) {
        data.skills = [];
      }

      // ================= NORMALIZE CERTIFICATIONS =================

      if (!Array.isArray(data.certifications)) {
        data.certifications = data.certifications ? [data.certifications] : [];
      }

      // ================= NORMALIZE ACHIEVEMENTS =================

      if (!Array.isArray(data.achievements)) {
        data.achievements = data.achievements ? [data.achievements] : [];
      }

      // ================= GENERATE OPTIMIZED PDF =================
      console.log("STEP 3");
      const filePath = `/tmp/optimized-${Date.now()}.pdf`;
      console.log("STEP 4");

      const doc = new PDFDocument({
        margin: 50,
      });

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // ================= HEADER =================

      doc.fontSize(24).text(data.personalInfo?.fullName || "Resume", {
        align: "center",
      });

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .text(
          `${data.personalInfo?.email || ""} | ${
            data.personalInfo?.phone || ""
          } | ${data.personalInfo?.location || ""}`,
          {
            align: "center",
          },
        );

      doc.moveDown();

      // ================= SUMMARY =================

      if (data.summary) {
        doc.fontSize(18).text("Professional Summary");

        doc.moveDown(0.5);

        doc.fontSize(12).text(data.summary);

        doc.moveDown();
      }

      // ================= SKILLS =================

      if (data.skills.length > 0) {
        doc.fontSize(18).text("Skills");

        doc.moveDown(0.5);

        data.skills.forEach((skill) => {
          doc
            .fontSize(12)
            .text(
              `${skill.category || "Skills"}: ${
                skill.items?.join(", ") || ""
              }`,
            );

          doc.moveDown(0.3);
        });

        doc.moveDown();
      }

      // ================= PROJECTS =================

      if (data.projects.length > 0) {
        doc.fontSize(18).text("Projects");

        doc.moveDown(0.5);

        data.projects.forEach((project) => {
          doc.fontSize(13).text(project.title || "");

          if (project.techStack) {
            doc.fontSize(11).text(`Tech Stack: ${project.techStack}`);
          }

          if (project.description) {
            doc.fontSize(11).text(project.description);
          }

          doc.moveDown();
        });
      }

      // ================= EXPERIENCE =================

      if (data.experience.length > 0) {
        doc.fontSize(18).text("Experience");

        doc.moveDown(0.5);

        data.experience.forEach((exp) => {
          doc.fontSize(13).text(`${exp.role || ""} - ${exp.company || ""}`);

          if (exp.duration) {
            doc.fontSize(11).text(exp.duration);
          }

          if (exp.description) {
            doc.fontSize(11).text(exp.description);
          }

          doc.moveDown();
        });
      }

      // ================= EDUCATION =================

      if (data.education.length > 0) {
        doc.fontSize(18).text("Education");

        doc.moveDown(0.5);

        data.education.forEach((edu) => {
          doc.fontSize(13).text(edu.degree || "");

          if (edu.institution) {
            doc.fontSize(11).text(edu.institution);
          }

          if (edu.years) {
            doc.fontSize(11).text(edu.years);
          }

          if (edu.gpa) {
            doc.fontSize(11).text(`GPA: ${edu.gpa}`);
          }

          doc.moveDown();
        });
      }

      // ================= CERTIFICATIONS =================

      if (data.certifications.length > 0) {
        doc.fontSize(18).text("Certifications");

        doc.moveDown(0.5);

        data.certifications.forEach((cert) => {
          doc.fontSize(12).text(`• ${cert.name || cert.title || cert}`);

          doc.moveDown(0.3);
        });

        doc.moveDown();
      }

      // ================= ACHIEVEMENTS =================

      if (data.achievements.length > 0) {
        doc.fontSize(18).text("Achievements");

        doc.moveDown(0.5);

        data.achievements.forEach((ach) => {
          doc.fontSize(12).text(`• ${ach.title || ach}`);

          doc.moveDown(0.3);
        });

        doc.moveDown();
      }

      // ================= FINALIZE PDF =================

      doc.end();

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      // ================= UPLOAD OPTIMIZED PDF =================

      const optimizedPdf = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw",
        folder: "optimized_resumes",
      });

      // ================= DELETE TEMP FILE =================

      fs.unlinkSync(filePath);

      // ================= SAVE TO DB =================

      const resume = new ResumeModel({
        userId: req.user.id,
        publicId: resultpdf.public_id,
        fileUrl: resultpdf.secure_url,
        fileName: req.file.originalname,
        jobTitle: jobTitle,
        atsScore: parsed.ats_score || 0,
        improvements: parsed.improvements || [],
        pros: parsed.pros || [],
        cons: parsed.cons || [],
        graph: parsed.skills_analysis || [],
        optimizedResume: data,
        optimizedFileUrl: optimizedPdf.secure_url,
      });

      await resume.save();

      // ================= RESPONSE =================

      return res.status(201).json({
        message: "Resume uploaded successfully",
        payload: resume,
      });
    } catch (err) {
      console.log("UPLOAD ERROR:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  },
);

// ================= SOFT DELETE =================

resumeApp.put("/softdelete/:id", verifyToken("USER"), async (req, res) => {
  try {
    const updated = await ResumeModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: new mongoose.Types.ObjectId(req.user.id),
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument: "after",
      },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume moved to trash",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET ALL RESUMES =================

resumeApp.get("/resume", verifyToken("USER"), async (req, res) => {
  try {
    const resumes = await ResumeModel.find({
      userId: req.user.id,
      isDeleted: false,
    });

    res.status(200).json({
      message: "User resumes fetched successfully",
      payload: resumes,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= GET RESUME BY ID =================

resumeApp.get("/resume/:id", verifyToken("USER"), async (req, res) => {
  try {
    const resume = await ResumeModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    res.status(200).json({
      payload: resume,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= TRASH =================

resumeApp.get("/trash", verifyToken("USER"), async (req, res) => {
  try {
    const resumes = await ResumeModel.find({
      userId: req.user.id,
      isDeleted: true,
    });

    const filtered = resumes.map((r) => ({
      id: r._id,
      fileName: r.fileName,
      fileUrl: r.fileUrl,
    }));

    res.status(200).json({
      message: "Trash Bin",
      payload: filtered,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= PERMANENT DELETE =================

resumeApp.delete("/permanent/:id", verifyToken("USER"), async (req, res) => {
  try {
    const resume = await ResumeModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: true,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume permanently deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= RESTORE =================

resumeApp.patch("/restore/:id", verifyToken("USER"), async (req, res) => {
  try {
    const resume = await ResumeModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        isDeleted: true,
      },
      {
        isDeleted: false,
      },
      {
        returnDocument: "after",
      },
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume restored",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= DOWNLOAD =================

resumeApp.get("/download/:id", verifyToken("USER"), async (req, res) => {
  try {
    const resume = await ResumeModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      optimizedFileUrl: resume.optimizedFileUrl,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
