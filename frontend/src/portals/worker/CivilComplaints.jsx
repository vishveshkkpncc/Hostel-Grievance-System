import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Complaints.css';
import { getToken, getUser } from "../../utils/auth";

function CivilComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user?.name) {
      console.error("Worker not authenticated or name missing");
      return;
    }

    fetch(`http://localhost:5000/api/complaints/worker/${encodeURIComponent(user.name)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const civilComplaints = data
          .filter((c) => c.category === "Civil" && c.status !== "resolved")
          .sort((a, b) => {
            // Emergency first
            if (a.priority === "Emergency" && b.priority !== "Emergency") return -1;
            if (a.priority !== "Emergency" && b.priority === "Emergency") return 1;

            // FCFS (older first)
            return new Date(a.registeredOn) - new Date(b.registeredOn);
          });

        setComplaints(civilComplaints);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="/VNIT_logo.png" alt="Logo" />
          <span>VNIT, Nagpur</span>
        </div>
        <div className="heading">
          <h1>Civil Complaints</h1>
        </div>
        <div className="logout">
          <Link to="/" className="logout-link">LOGOUT</Link>
        </div>
      </nav>
      <div className="complaints-container">
        {complaints.length > 0 ? (
          complaints.map(complaint => (
            <div key={complaint._id} className="complaint">
              <p><span className="label">Problem:</span> {complaint.issueType}</p>
              <p><span className="label">Priority:</span> {complaint.priority}</p>
              <p><span className="label">HostelBlock:</span> {complaint.hostel}</p>
              <p><span className="label">RoomNumber:</span> {complaint.room}</p>
              <p><span className="label">Status:</span> {complaint.status}</p>
              {complaint.cost && (<p><span className="label">Cost:</span> {complaint.cost}</p>)}
              {complaint.reason && (<p><span className="label">Reason:</span> {complaint.reason}</p>)}
              <Link to={`/worker/update-complaint/civil/${complaint._id}`} className="update-link">Update Progress</Link>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', marginTop: '50px' }}>
            <h2>No complaints found</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default CivilComplaints;
