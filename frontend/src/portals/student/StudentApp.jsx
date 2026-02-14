import { Routes, Route, Navigate } from "react-router-dom";
import { requireAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/Dashboard";
import LanComplaints from "./components/ComplaintsForm/LanComplaints";
import CivilComplaints from "./components/ComplaintsForm/CivilComplaints";
import ElectricalComplaints from "./components/ComplaintsForm/ElectricalComplaints";
import ViewComplaints from "./components/ViewComplaints";
import StudentAnnouncements from "./components/StudentAnnouncements";
import StudentProfile from "./components/StudentProfile";
import ChangePassword from "./components/ChangePassword";
import "./styles/layout.css";
import "./styles/theme.css";
import "./styles/student.css";

export default function StudentApp() {
  const navigate = useNavigate();

  // Set studentId from authenticated user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.userId) {
    localStorage.setItem("studentId", user.userId);
  }

  if (!requireAuth(navigate, "student")) {
    return null;
  }

  return (
    <div className="page student-theme">
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lan-complaint" element={<LanComplaints />} />
            <Route path="civil-complaint" element={<CivilComplaints />} />
            <Route path="electrical-complaint" element={<ElectricalComplaints />} />
            <Route path="view-complaints" element={<ViewComplaints />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="updates" element={<StudentAnnouncements />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
