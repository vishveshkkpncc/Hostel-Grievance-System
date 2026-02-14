import { Routes, Route, Navigate } from "react-router-dom";
import { requireAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

export default function AdminApp() {
  const navigate = useNavigate();

  if (!requireAuth(navigate, "admin")) {
    return null;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
