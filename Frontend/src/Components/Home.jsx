import React from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/LOGO.jpeg";
import demoVideo from "../assets/video.mp4"; // import your video file

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow">
        <img src={LOGO} alt="LOGO" className="h-12 w-auto" />

        <div className="flex space-x-4">
          <Link
            to="/signin"
            className="px-4 py-2 border border-emerald-500 bg-emerald-500 text-gray-800 rounded hover:bg-emerald-300 transition"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 border border-emerald-500 bg-emerald-500 text-gray-800 rounded hover:bg-emerald-300 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-16">
        {/* Left Content */}
        <div className="max-w-lg">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Smarter CVs, Faster Decisions
          </h1>

          <p className="text-gray-600 mb-7">
            AI Resume Analyzer
            Stop scanning endless CVs — let AI surface the right talent with
            instant match scores and keyword insights.
          </p>

          <Link
            to="/signup"
            className="px-4 py-2 border border-emerald-500 bg-emerald-500 text-gray-800 rounded hover:bg-emerald-300 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Right Video Placeholder */}
        <div className="mt-10 md:mt-0 md:ml-12 flex justify-center items-center w-full md:w-1/2">
          <div className="w-96 h-80 rounded-xl  overflow-hidden bg-white flex justify-center items-center">
            <video
              src={demoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
