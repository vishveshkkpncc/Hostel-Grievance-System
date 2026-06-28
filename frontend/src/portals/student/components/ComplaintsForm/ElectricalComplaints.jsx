import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Complaints.css";

export default function ElectricalComplaints() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    hostel: "",
    roomNumber: "",
    issueType: "",
    description: "",
    contactNumber: ""
  });
  const [priority, setPriority] = useState("Normal");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const studentId = user.userId || localStorage.getItem("studentId") || formData.rollNumber;
    const complaintPayload = {
      studentName: formData.studentName,
      studentId: studentId,
      contactNumber: formData.contactNumber,
      category: "Electrical",
      issueType: formData.issueType,
      description: formData.description,
      hostel: formData.hostel,
      room: formData.roomNumber,
      priority: priority
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(complaintPayload)
      });

      if (res.ok) {
        alert("Complaint submitted successfully");
        navigate("/student/dashboard");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to submit complaint");
      }
    } catch (err) {
      console.error(err);
      alert("Server error: " + err.message);
    }
  };
  return (
    <div className="form-page">
        <div className="heading">
            <h2>Electrical Complaint Form</h2>
        </div>
      

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Student Name</label>
          <input 
            name="studentName"
            placeholder="Enter your full name"
            value={formData.studentName}
            id="studentName" 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="form-row">
            <label htmlFor="rollNumber">Student Id</label>
            <input
            id="rollNumber"
            name="rollNumber"
            placeholder="Enter roll number"
            value={formData.rollNumber}
            onChange={handleInputChange}
            required
            />
        </div>

        <div className="form-row">
            <label htmlFor="hostel">Hostel Name</label>
            <select
            id="hostel"
            name="hostel"
            value={formData.hostel}
            onChange={handleInputChange}
            required
            >
              <option value="">Select Hostel</option>
              <option value="Kalpana Chawla">Kalpana Chawla</option>
              <option value="Dr.Anandi Gopal Joshi">Dr.Anandi Gopal Joshi</option>
              <option value="Aryabhatta">Aryabhatta</option>
              <option value="S.Ramanujan">S.Ramanujan</option>
              <option value="M.S.Swaminathan">M.S.Swaminathan</option>
              <option value="V.G.Bhide">V.G.Bhide</option>
              <option value="A.P.J.Abdul Kalam">A.P.J.Abdul Kalam</option>
              <option value="C.V.Raman">C.V.Raman</option>
              <option value="Homi J.Bhabha">Homi J.Bhabha</option>
              <option value="J.C.Bose">J.C.Bose</option>
              <option value="Meghnad Saha">Meghnad Saha</option>
              <option value="Vikram Sarabhai">Vikram Sarabhai</option>
            </select>
        </div>

        <div className="form-row">
            <label htmlFor="roomNumber">Room Number</label>
            <input
            id="roomNumber"
            name="roomNumber"
            placeholder="Enter room number"
            value={formData.roomNumber}
            onChange={handleInputChange}
            required
            />
        </div>

        <div className="form-row">
          <label>Issue Type</label>
          <select
            id="issueType"
            name="issueType" 
            value={formData.issueType}
            onChange={handleInputChange} 
            required

        >
            <option value="">Select Issue type</option>
            <option value="fan-not-working">Fan Not Working</option>
            <option value="light-issue">Light Issue</option>
            <option value="switch-board-problem">Switch Board Problem</option>
            <option value="power-fluctuation">Power Fluctuation</option>
          </select>
        </div>

        <div className="form-row">
          <label>Priority</label>
          <select 
          value={priority}
          onChange={(e)=> setPriority(e.target.value)} required>
            <option value="Normal">Normal</option>
            <option value="Emergency">Emergency</option>
            
          </select>

        </div>
        
        <div className="form-row">
            <label htmlFor="description">Issue Description</label>
            <textarea
            id="description"
            name="description"
            placeholder="Describe the issue in detail"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            />
        </div>

        <div className="form-row">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
            id="contactNumber"
            name="contactNumber"
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            />
        </div>
        <div className="form-buttons">
          <button className="ui-btn submit-btn">Submit</button>
          <button type="button" className="ui-btn back-btn" onClick={() => navigate("/student/dashboard")}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
