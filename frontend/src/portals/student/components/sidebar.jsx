import "../styles/sidebar.css";
import { useNavigate } from "react-router-dom";
import {FaUserCircle} from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import {IoNotifications} from "react-icons/io5";
import {FiLogOut} from "react-icons/fi";
import { logout } from "../../../utils/auth";

export default function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar">
      <div className="vnitLogo">
        <img src="/VNIT_logo.png" alt="VNIT" />
      </div>

      <div className="sidebar-button">
        <button className="ui-btn" onClick={() => navigate('/student/profile')}>
          <FaUserCircle className="sidebar-icon"/>View Profile</button>
        <button className="ui-btn" onClick={() => navigate('/student/change-password')}>
          <MdLock className="sidebar-icon"/>Change Password</button>
        <button className="ui-btn" onClick={()=> navigate("/student/view-complaints")}>
          <FaClipboardList className="sidebar-icon"/>View Complaints</button>
        <button className="ui-btn" onClick={() => navigate("/student/updates")}>
          <IoNotifications className="sidebar-icon"/>Updates</button>
        <button className="ui-btn logout" onClick={handleLogout}>
          <FiLogOut className="sidebar-icon"/>Logout</button>
      </div>
    </div>
  );
}