import { useState, useEffect } from "react";


const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [complaints, setComplaints] =useState([]);
  const fetchComplaints = () => {
  const token = localStorage.getItem("token");
  fetch("http://localhost:5000/api/complaints", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setComplaints(data))
    .catch(err => console.error(err));
};
  const pendingCount = complaints.filter(c => c.status === "pending").length;
  const inprogressCount = complaints.filter(c => c.status === "inprogress").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;

  useEffect(() => {
  fetchComplaints();
}, [view]);

  
  const [sortByPriority, setSortByPriority]= useState(false);
  const [performance, setPerformance] = useState([]);

  const fetchPerformance = () => {
    const token = localStorage.getItem("token");
    // Correct endpoint is served from the complaints router:
    // /api/complaints/workers/performance
    fetch("http://localhost:5000/api/complaints/workers/performance", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setPerformance(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (view === "workerPerformance") {
      fetchPerformance();
    }
  }, [view]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [announcementText,setAnnouncementText]= useState("");
  const [announcements,setAnnouncements]=useState([]);
  const [editId, setEditId]=useState(null);
  const handlePost = async () => {
    console.log("post clicked",announcementText);
  if (!announcementText.trim()) return;

  const token = localStorage.getItem("token");
  await fetch("http://localhost:5000/api/announcements", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text: announcementText }),
  });

  fetchAnnouncements();
};
  const handleDelete = async (id) => {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:5000/api/announcements/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  fetchAnnouncements();
};
  const handleEdit = (a) => {
  setAnnouncementText(a.text);
  setEditId(a._id);
};
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
};
  const daysAgo = (dateStr) => {
  const today = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  return diff;
};
const fetchAnnouncements = () => {
  const token = localStorage.getItem("token");
  fetch("http://localhost:5000/api/announcements", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setAnnouncements(data));
};
useEffect(() => {
  fetchAnnouncements();
}, []);
  return (
    <div>
      <style>{`
        .card {
          cursor: pointer;
          background: linear-gradient(135deg,#eaf3ff,#dbeafe);
          padding: 25px;
          width: 160px;
          text-align: center;
          margin: 10px 0;
          border-radius: 12px;
          font-weight:600;
          transition: all 0.25s ease;
        }
        .complaint {
          cursor: pointer;
          background: #e0e0e0;
          padding: 20px;
          margin: 10px 0;
          border-radius: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.18);
        }
        .complaint:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .emergency {
          color: red;
          font-weight: bold;
        }
        .electrical {
          background-color: #fff8e1;
        }
        .lan {
          background-color: #e3f2fd;
        }
        .civil {
          background-color: #e8f5e9;
        }
        .category {
          font-size:13px;
          color: #555;
          position:absolute;
          top:8px;
          right:12px;
        }
        table th, table td {
        padding: 12px;
        border-bottom: 1px solid #ddd;
      }

      table tr:hover {
        background-color: #f9f9f9;
      }

      table th {
        text-align: left;
      }
      `}</style>

      {/* Top Bar */}
      {view !== "dashboard" && (
  <button
    onClick={() => {
  fetchComplaints();
  setView("dashboard");
}}
  >
    ← Back to Dashboard
  </button>
      )}
      <div style={styles.topBar}>
        <h2>{view === "dashboard" ? "Admin Dashboard" : "Complaints"}</h2>
        <button onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }}>Logout</button>
      </div>

      {/* Dashboard */}
      {view === "dashboard" && (
  <>
  <div style={{ textAlign: "right", width: "90%", margin: "20px auto" }}>
  <button
    onClick={() => setView("workerPerformance")}
    style={{
      padding: "8px 16px",
      background: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Worker Performance
  </button>
</div>
    {/* Cards */}
    <div style={styles.cardContainer}>
      <div className="card" onClick={() => setView("inprogress")}>In Progress<div>{inprogressCount}</div>
    </div>
      <div className="card" onClick={() => setView("pending")}>Pending<div>{pendingCount}</div>
    </div>
      <div className="card" onClick={() => setView("resolved")}>Resolved<div>{resolvedCount}</div>
    </div>
    </div>
    
    {/* 📢 Announcement Section */}
    <div
  style={{
    width: "60%",
    margin: "40px auto",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
  }}
>
      <h3>📢 Announcements</h3>
      <ul style={{ marginTop: "20px" }}>
  {announcements.map((a, index) => (
    <li
      key={a._id}
      style={{
        background: index === 0 ? "#fff7cc" : "#f5f5f5",
        padding: "10px",
        marginBottom: "8px",
        borderRadius: "6px",
      }}
    >
      <b>{a.text}</b>

      <div style={{ fontSize: "12px", color: "gray" }}>
        Posted on: {new Date(a.createdAt).toLocaleString()}
      </div>

      <button onClick={() => handleDelete(a._id)}>Delete</button>
    </li>
  ))}
</ul>

      <textarea
        placeholder="Write announcement..."
        value={announcementText}
        onChange={(e) => setAnnouncementText(e.target.value)}
        style={{ width: "96%", padding: "12px",borderRadius:"8px",border:"1px solid #ccc",resize:"none" }}
      />

      <button onClick={handlePost} style={{ marginTop: "10px",padding:"8px 16px",background:"#1976d2",color:"white",border:"none",borderRadius:"6px",cursor:"pointer" }}>
        {editId ? "Update" : "Post"}
      </button>

    </div>
  </>
)}
{view === "workerPerformance" && (
  <div style={{ width: "90%", margin: "30px auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Worker Performance Analytics</h2>
    </div>
    <table>
    <thead>
      <tr>
        <th>Worker</th>
        <th>Category</th>
        <th>Complaints</th>
        <th>Avg Rating</th>
        <th>Total Cost</th>
      </tr>
    </thead>
    <tbody>
      {performance.map(w => (
        <tr key={w._id}>
          <td>{w._id}</td>
          <td>{w.category}</td>
          <td>{w.complaintsHandled}</td>
          <td>
          {w.avgRating ? `${w.avgRating.toFixed(2)} ⭐` : "Not rated"}
          </td>
          <td>₹ {w.totalCost}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
)}
      
      

      {/* Inprogress Complaints */}
{view === "inprogress" && (
  <div style={styles.listContainer}>
    {complaints
  .filter(c => c.status === "inprogress")
  .sort((a, b) => {
    if (a.priority === "Emergency" && b.priority !== "Emergency") return -1;
    if (a.priority !== "Emergency" && b.priority === "Emergency") return 1;
    return new Date(a.registeredOn) - new Date(b.registeredOn); // FCFS
  })
      .map(c => (
        <div
          key={c._id}
          className={`complaint ${c.category.toLowerCase()}`}
          onClick={() => {
            setSelectedComplaint(c);
            setView("details");
          }}
          style={{ position: "relative" }}
        >
          <div className="category">{c.category}</div>
          <div>{c.issueType}</div>
          <div className={c.priority === "Emergency" ? "emergency" : ""}>
            {c.priority}
          </div>
        </div>
      ))}
  </div>
)}
      {/* Pending Complaints */}
{view === "pending" && (
  <div style={{ width: "60%", margin: "20px auto", textAlign: "right" }}>
    <button onClick={() => setSortByPriority(!sortByPriority)}>
      Sort by Priority
    </button>
  </div>
)}
{view === "pending" && (
  <div style={styles.listContainer}>
    {complaints
  .filter(c => c.status === "pending")
  .sort((a, b) => {
  if (!sortByPriority) {
    return new Date(a.registeredOn) - new Date(b.registeredOn);
  }

  if (a.priority === "Emergency" && b.priority !== "Emergency") return -1;
  if (a.priority !== "Emergency" && b.priority === "Emergency") return 1;

  return new Date(a.registeredOn) - new Date(b.registeredOn);
})
      .map(c => (
        <div
          key={c._id}
          className={`complaint ${c.category.toLowerCase()}`}
          onClick={() => {
            setSelectedComplaint(c);
            setView("details");
          }}
          style={{ position: "relative" }}
        >
          <div className="category">{c.category}</div>
          <div>{c.issueType}</div>
          <div className={c.priority === "Emergency" ? "emergency" : ""}>
            {c.priority}
          </div>
{/* 👇 ADD THIS BLOCK */}
<p style={{ fontSize: "13px", marginTop: "6px" }}>
  {c.worker === "Unassigned"
    ? "Awaiting assignment"
    : `Assigned to ${c.worker}`}
</p>
        </div>
      ))}
  </div>
)}
{/* Resolved Complaints */}
{view === "resolved" && (
  <div style={styles.listContainer}>
    {complaints
      .filter(c => c.status === "resolved")
      .map(c => (
        <div
          key={c._id}
          className={`complaint ${c.category.toLowerCase()}`}
          onClick={() => {
            setSelectedComplaint(c);
            setView("details");
          }}
          style={{ position: "relative" }}
        >
          <div className="category">{c.category}</div>
          <div>{c.issueType}</div>
          <div className={c.priority === "Emergency" ? "emergency" : ""}>
            {c.priority}
          </div>
        </div>
      ))}
  </div>
)}
      {/* Complaint Details Page */}
{view === "details" && selectedComplaint && (
  <div style={styles.detailsContainer}>
    <div style={styles.detailsCard}>
      <h3>Complaint Details</h3>

      <div className="row"><b>Complaint:</b> {selectedComplaint.issueType}</div>
      <div className="row"><b>Category:</b> {selectedComplaint.category}</div>
      <div className="row"><b>Priority:</b> {selectedComplaint.priority}</div>
      <div className="row"><b>Description:</b> {selectedComplaint.description}</div>
      <div className="row"><b>Hostel:</b> {selectedComplaint.hostel}</div>
      <div className="row"><b>Room:</b> {selectedComplaint.room}</div>

      {selectedComplaint.registeredOn && (
  <div className="row">
  <b>Complaint Registered On:</b>{" "}
  {formatDate(selectedComplaint.registeredOn)} 
    {selectedComplaint.status === "pending" && (
      <> ({daysAgo(selectedComplaint.registeredOn)} days ago)</>
    )}
  </div>
)}

      {/* ONLY FOR Inprogress */}
{selectedComplaint.status === "inprogress" && (
  <>
    <div className="row">
      <b>Assigned Worker:</b> {selectedComplaint.worker}
    </div>
    <div className="row">
      <b>Assigned On:</b> {formatDate(selectedComplaint.assignedOn)}
    </div>
    <div className="row">
      <b>Cost:</b> ₹{selectedComplaint.cost}
    </div>
    <div className="row">
      <b>Reason:</b> {selectedComplaint.reason}
    </div>
  </>
)}
{/* ONLY FOR RESOLVED */}
{selectedComplaint.status === "resolved" && (
  <>
    <div className="row"><b>Resolved By:</b> {selectedComplaint.worker}</div>
    <div className="row"><b>Cost:</b> ₹{selectedComplaint.cost}</div>
    <div className="row"><b>Resolved On:</b> {formatDate(selectedComplaint.resolvedOn)}</div>
  </>
)}
      
    </div>
  </div>
)}

    </div>
    
  );
};

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 30px",
    background: "#ffffff",
    boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
    position:"sticky",
    top:0,
    zIndex:10
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px",
  },
  listContainer: {
    width: "60%",
    margin: "30px auto",
  },
};

export default AdminDashboard;