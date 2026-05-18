import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Fname: "",
    Lname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.Fname || !form.Lname || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://ai-resume-analyzer-team-1.onrender.com/commonApi/register",
        form,
      );

      setSuccess(response.data.message);
      setError("");

      console.log(response.data);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-700">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}

        <input
          type="text"
          name="Fname"
          placeholder="First Name"
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-emerald-600"
        />

        <input
          type="text"
          name="Lname"
          placeholder="Last Name"
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-emerald-600"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-emerald-600"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-emerald-600"
        />

        <button className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
