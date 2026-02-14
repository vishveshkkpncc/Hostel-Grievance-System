import { Routes, Route, Navigate } from "react-router-dom";
import { requireAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import CivilComplaints from "./CivilComplaints";
import ElectricalComplaints from "./ElectricalComplaints";
import LanComplaints from "./LanComplaints";
import UpdateComplaint from "./UpdateComplaint";

export default function WorkerApp() {
  const navigate = useNavigate();

  if (!requireAuth(navigate, "worker")) {
    return null;
  }

  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/civil" element={<CivilComplaints />} />
      <Route path="/electrical" element={<ElectricalComplaints />} />
      <Route path="/lan" element={<LanComplaints />} />
      <Route path="/update-complaint/:type/:id" element={<UpdateComplaint />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
