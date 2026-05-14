import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import LOGO from "../assets/LOGO.jpeg";
import { useAuth } from "../store/authStore";

const Dashboard = () => {
  const navigate = useNavigate();

  const { isAuthenticated, checkAuth, logout, loading } = useAuth();

  const [files, setFiles] = useState([]);

  // upload states
  const [jobRole, setJobRole] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [droppedFileName, setDroppedFileName] = useState("");

  // upload loading
  const [uploadLoading, setUploadLoading] = useState(false);

  // ================= FETCH RESUMES =================
  const fetchResumes = async () => {
    try {
      const res = await axios.get("https://ai-resume-analyzer-team-1.onrender.com/resumeApi/resume", {
        withCredentials: true,
      });

      setFiles(res.data.payload || []);
    } catch (err) {
      console.log("Fetch resumes error:", err);
    }
  };

  // ================= CHECK AUTH =================
  useEffect(() => {
    const initializeDashboard = async () => {
      await checkAuth();
    };

    initializeDashboard();
  }, [checkAuth]);

  // ================= AUTH STATE =================
  useEffect(() => {
    if (isAuthenticated === true) {
      fetchResumes();
    }

    if (isAuthenticated === false) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DROPZONE =================
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setDroppedFileName(acceptedFiles[0].name);
    }
  };
console.log(1);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });
console.log(2);
  // ================= UPLOAD =================
  const handleFileUpload = async () => {
    try {
      if (!selectedFile || !jobRole) {
        alert("Please select a PDF and enter Job Title");
        return;
      }
console.log(3);
      setUploadLoading(true);

      const formData = new FormData();

      // MUST MATCH BACKEND upload.single("resume")
      formData.append("resume", selectedFile);
console.log(4);
      // MUST MATCH BACKEND req.body.jobTitle
      formData.append("jobTitle", jobRole);
console.log(5);
      const res = await axios.post(
        "https://ai-resume-analyzer-team-1.onrender.com/resumeApi/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
console.log(6);
      const uploadedResume = res.data.payload;
console.log(7);
      // refresh resumes
      await fetchResumes();

      // clear fields
      setSelectedFile(null);
      setDroppedFileName("");
      setJobRole("");

      // navigate to overview
      navigate(`/resume/${uploadedResume._id}`);
    } catch (err) {
      console.log("Upload error:", err);

      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  // ================= SOFT DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.put(
        `https://ai-resume-analyzer-team-1.onrender.com/resumeApi/softdelete/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      fetchResumes();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ================= AUTH LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  // ================= UPLOAD LOADING =================
  if (uploadLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        {/* Spinner */}
        <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Title */}
        <h1 className="mt-8 text-3xl font-bold text-gray-800 text-center">
          Optimizing Your Resume
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-500 text-center max-w-lg leading-7">
          Please wait while AI analyzes your resume, calculates ATS score,
          generates improvements, and creates an optimized professional PDF.
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Note */}
        <p className="mt-8 text-sm text-gray-400 text-center">
          This may take a few seconds depending on PDF size
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <div className="bg-[#17233A] px-6 py-3 flex justify-between items-center shadow-md">
        {/* LOGO */}
        <img src={LOGO} className="w-16 bg-white p-2 rounded-lg" alt="logo" />

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2 rounded-lg font-semibold transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* ================= UPLOAD CARD ================= */}
          <div className="bg-white p-5 rounded-2xl shadow-lg h-[430px] flex flex-col">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-5">
              Upload Resume
            </h2>

            {/* JOB TITLE */}
            <input
              type="text"
              placeholder="Enter Job Title"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg mb-5 outline-none focus:border-emerald-500"
            />

            {/* DROPZONE */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl flex-1 flex items-center justify-center text-center cursor-pointer transition
              ${
                isDragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-400 bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />

              {droppedFileName ? (
                <div>
                  <p className="text-lg font-semibold text-emerald-700 break-all px-3">
                    {droppedFileName}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    PDF Selected Successfully
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drag & Drop PDF here
                  </p>

                  <p className="text-gray-400 mt-2">or Click to Upload</p>
                </div>
              )}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              onClick={handleFileUpload}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
            >
              Upload Resume
            </button>
          </div>

          {/* ================= FILES CARD ================= */}
          <div className="bg-white p-5 rounded-2xl shadow-lg h-[430px] flex flex-col">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-5">
              Uploaded Files
            </h2>

            {files.length === 0 ? (
              <div className="flex-1 flex justify-center items-center text-gray-400">
                No files uploaded yet
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                {files.map((file) => (
                  <div
                    key={file._id}
                    className="flex justify-between items-center border border-gray-200 p-4 rounded-xl hover:shadow-md transition"
                  >
                    {/* FILE INFO */}
                    <div className="overflow-hidden">
                      <p className="text-lg font-semibold text-gray-800 truncate">
                        {file.fileName}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {file.jobTitle}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4 ml-3">
                      {/* VIEW */}
                      <button
                        onClick={() => navigate(`/resume/${file._id}`)}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        View
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="text-red-500 text-xl cursor-pointer"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= TRASH BUTTON ================= */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/trash")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-xl transition font-medium cursor-pointer"
          >
            Go to Trash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
