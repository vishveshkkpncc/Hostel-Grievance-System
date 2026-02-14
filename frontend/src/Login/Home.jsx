import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="overlay">
        
        {/* TITLE */}
        <h1>Hostel Grievance System</h1>
        <p className="tagline">
          "A smart way to report & resolve hostel issues"
        </p>

        {/* LOGIN BUTTON */}
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        
        {/* FOOTER LINKS */}
        <div className="home-links">
          <a href="https://vnit.ac.in" target="_blank">VNIT Website</a>
          <a href="https://vnit.ac.in/section/hostel/" target="_blank">Hostel Website</a>
          <a href="https://vnit.ac.in/section/hostel/hostel-section-staff/" target="_blank">Contact Hostel Staff</a>
        </div>
      </div>
    </div>
  );
}