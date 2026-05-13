import React, { useEffect, useState } from "react";
import LOGO from "../assets/LOGO.jpeg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import ScoreMeter from "./ScoreMeter";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../store/authStore";

function ResumeOverview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { logout } = useAuth();

  const [resumeData, setResumeData] = useState(null);

  // ================= FETCH RESUME =================
  const fetchResume = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/resumeApi/resume/${id}`,
        {
          withCredentials: true,
        },
      );

      console.log(res.data);

      setResumeData(res.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  if (!resumeData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  // ================= DATA =================
  const resume = resumeData.fileUrl;
  const ats = resumeData.atsScore;
  const improvements = resumeData.improvements || [];
  const pros = resumeData.pros || [];
  const cons = resumeData.cons || [];

  // ONLY TOP 5 SKILLS
  const graph = (resumeData.graph || []).slice(0, 5);

  const optimized = resumeData.optimizedFileUrl;

  return (
    <div>
      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center bg-gray-800">
        <img className="w-30 m-3" src={LOGO} alt="logo" />

        <div className="flex items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-3 border-2 px-1.5 h-10 rounded-md bg-emerald-500 text-black transition-transform duration-200 hover:scale-110 hover:bg-emerald-200"
          >
            Back to home
          </button>

          <button
            onClick={handleLogout}
            className="mr-3 border-2 px-1.5 h-10 rounded-md bg-emerald-500 text-black transition-transform duration-200 hover:scale-110 hover:bg-emerald-200"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ================= MAIN GRID ================= */}
      <div className="grid sm:grid-cols-6 sm:grid-rows-16 sm:h-400 grid-cols-1 grid-rows-36 h-700 ">
        {/* ================= IMPROVEMENTS ================= */}
        <div
          className="
          p-4 sm:p-7
          m-3
          rounded-2xl
          bg-white
          border border-gray-200
          shadow-[0_0_15px_5px_rgba(0,0,0,0.08)]
          overflow-hidden
          sm:row-span-4 sm:col-span-2
          sm:row-start-5 sm:row-end-9
          sm:col-start-4 sm:col-end-7
          row-span-4
          col-start-1 -col-end-2
          row-start-17 row-end-21
          "
        >
          <div className="mb-5 border-b pb-3">
            <h1 className="font-semibold text-2xl text-gray-800">
              Improvements
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Areas that can strengthen the resume further
            </p>
          </div>

          <div className="overflow-y-auto h-[85%] pr-2 space-y-5">
            {improvements.map((i, index) => (
              <div
                key={index}
                className="
                bg-gray-50
                border border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                "
              >
                <h1
                  className="
                  font-semibold
                  text-lg
                  text-gray-800
                  mb-2
                  "
                >
                  {i.heading}
                </h1>

                <p
                  className="
                  text-gray-600
                  leading-7
                  text-[15px]
                  "
                >
                  {i.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SCORE ================= */}
        <div className="p-7 m-3 rounded-2xl shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] sm:row-span-1 sm:col-span-1 sm:row-start-1 sm:row-end-5 sm:col-start-1 sm:col-end-3 row-span-4 col-start-1 -col-end-2 row-start-1 row-end-5 flex flex-col ">
          <h1 className="font-sans text-xl">Score</h1>

          <div>
            <ScoreMeter score={ats} />
          </div>
        </div>

        {/* ================= GRAPH ================= */}
        <div
          className="
          p-4 sm:p-7
          m-3
          rounded-2xl
          bg-white
          border border-gray-200
          shadow-[0_0_15px_5px_rgba(0,0,0,0.1)]
          sm:row-span-1 sm:col-span-1
          sm:row-start-5 sm:row-end-9
          sm:col-start-1 sm:col-end-4
          row-span-4
          col-start-1 -col-end-2
          row-start-5 row-end-9
          overflow-hidden
          "
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold text-2xl text-gray-800">Top Skills</h1>
          </div>

          <div className="w-full h-72 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={graph}
                margin={{
                  top: 10,
                  right: 20,
                  left: -10,
                  bottom: 50,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="skill"
                  tick={{ fontSize: 11 }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />

                <Tooltip />

                <Bar dataKey="score" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= PROS ================= */}
        <div className="p-7 m-3 rounded-2xl shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] sm:row-span-1 sm:col-span-2 sm:row-start-1 sm:row-end-5 sm:col-start-3 sm:col-end-5 row-span-4 col-start-1 -col-end-2 row-start-9 row-end-13 bg-white border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full z-10 bg-green-300 px-6 py-4 shadow-md rounded-t-2xl">
            <h1 className="text-2xl font-semibold text-gray-800">Pros</h1>
          </div>

          <div className="h-full overflow-y-auto pt-10 ">
            <ul className="space-y-4">
              {pros.map((p, index) => (
                <li
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= CONS ================= */}
        <div className="p-7 m-3 rounded-2xl shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] sm:row-span-1 sm:col-span-2 sm:row-start-1 sm:row-end-5 sm:col-start-5 sm:col-end-7 row-span-4 col-start-1 -col-end-2 row-start-13 row-end-17 bg-white border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full z-10 bg-red-400 px-6 py-4 shadow-md rounded-t-2xl">
            <h1 className="text-2xl font-semibold text-gray-800">Cons</h1>
          </div>

          <div className="h-full overflow-y-auto pt-10 ">
            <ul className="space-y-4">
              {cons.map((p, index) => (
                <li
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= ORIGINAL RESUME ================= */}
        <div className="p-7 m-3 rounded-2xl shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] sm:row-span-1 sm:col-span-2 sm:row-start-9 sm:row-end-17 sm:col-start-1 sm:col-end-4 row-span-8 col-start-1 -col-end-2 row-start-21 row-end-29">
          <div className="w-full h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    Resume Preview
                  </h1>

                  <p className="text-sm text-gray-500">
                    View and download the uploaded PDF
                  </p>
                </div>

                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all duration-200 shadow-md"
                >
                  Download PDF
                </a>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 bg-gray-200 p-4">
                {resume ? (
                  <iframe
                    src={resume}
                    title="resume-pdf"
                    className="w-full h-full rounded-xl border border-gray-300 bg-white"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-xl text-gray-500">
                    Resume not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= OPTIMIZED RESUME ================= */}
        <div className="p-7 m-3 rounded-2xl shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] sm:row-span-1 sm:col-span-2 sm:row-start-9 sm:row-end-17 sm:col-start-4 sm:col-end-7 row-span-8 col-start-1 -col-end-2 row-start-29 row-end-37">
          <div className="w-full h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    Enhanced Resume Preview
                  </h1>

                  <p className="text-sm text-gray-500">
                    View and download the uploaded PDF
                  </p>
                </div>

                <a
                  href={optimized}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all duration-200 shadow-md"
                >
                  Download PDF
                </a>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 bg-gray-200 p-4">
                {optimized ? (
                  <iframe
                    src={optimized}
                    title="optimized-pdf"
                    className="w-full h-full rounded-xl border border-gray-300 bg-white"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-xl text-gray-500">
                    Optimized resume not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeOverview;
