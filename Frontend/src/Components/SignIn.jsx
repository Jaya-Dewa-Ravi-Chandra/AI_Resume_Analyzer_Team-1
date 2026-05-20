import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

const SignIn = () => {
  const navigate = useNavigate();

  const { login, loading, error, isAuthenticated, currentUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // redirect after login
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // role-based navigation
      if (currentUser.role?.toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return alert("All fields are required");
    }

    if (!form.email.includes("@")) {
      return alert("Enter valid email");
    }

    const result = await login(form);
  if (result.success) {
    // get updated user from zustand
    const user = useAuth.getState().currentUser;
    if (user?.role?.toUpperCase() === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-700">
          Sign In
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-emerald-600"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-emerald-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
