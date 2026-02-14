import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    person: "Select"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.person === "Select") {
      setError("Please select a user type");
      return;
    }

    if (!formData.userId || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
          person: formData.person
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate based on role
      if (data.user.role === "student") {
        navigate("/student/dashboard");
      } else if (data.user.role === "worker") {
          if(data.user.department==="Electrical") navigate("/worker/electrical");
          else if(data.user.department==="Civil") navigate("/worker/civil");
          else if(data.user.department==="Lan") navigate("/worker/lan");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>Visvesvaraya National Institute of Technology</h1>
      </div>

      <div className="login-box">
        <h2>Hostel Information &<br />Management System</h2>

        <form onSubmit={handleSubmit}>
          <label>User ID</label>
          <input
            type="text"
            name="userId"
            placeholder="Enter your ID"
            value={formData.userId}
            onChange={handleInputChange}
            required
          />

          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <label id="selection">Select type:</label>
          <select
            id="person"
            name="person"
            value={formData.person}
            onChange={handleInputChange}
          >
            <option>Select</option>
            <option value="student">Student</option>
            <option value="worker">Worker</option>
            <option value="admin">Admin</option>
          </select>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
