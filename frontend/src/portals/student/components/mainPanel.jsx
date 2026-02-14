import { useNavigate } from "react-router-dom";
import {FaWifi} from "react-icons/fa";
import {MdHomeRepairService} from "react-icons/md";
import  {BsLightningChargeFill} from "react-icons/bs";

export default  function MainPanel() {
  const navigate=useNavigate();
  return (
    <>
    

      {/* CARDS */}
      <div className="card-grid">
        <div className="service-card lan" onClick={()=>navigate("/student/lan-complaint")}>
          <FaWifi className="card-icon"/>
          <h3>LAN Complaint</h3>
          <p>Internet & network related issues</p>
        </div>

        <div className="service-card civil" onClick={()=>navigate("/student/civil-complaint")}>
          <MdHomeRepairService className="card-icon"/>
          <h3>Civil Complaint</h3>
          <p>Hostel infrastructure issues</p>
        </div>

        <div className="service-card electrical" onClick={()=>navigate("/student/electrical-complaint")}>
          < BsLightningChargeFill className="card-icon"/>
          <h3>Electrical Complaint</h3>
          <p>Power & electrical problems</p>
        </div>
      </div>
    </>
  );
}