import { useState, useEffect } from "react";

const WORKERS = [
  { name: "Arun Sharma", category: "Electrical" },
  { name: "Bhavesh Patel", category: "Civil" },
  { name: "Deepak Verma", category: "Lan" },
];

const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState("");

  const [complaints, setComplaints] = useState([]);

  const getCategoryClass = (category) => {
    return typeof category === "string" ? category.toLowerCase() : "";
  };
  const fetchComplaints = async () => {
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to load complaints.");
        setComplaints([]);
        return;
      }

      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Network error while loading complaints.");
      setComplaints([]);
    }
  };
  const pendingCount = complaints.filter(c => c?.status === "pending").length;
  const inprogressCount = complaints.filter(c => c.status === "inprogress").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  const workerAnalytics = WORKERS.map(worker => {
    const workerComplaints = complaints.filter(c => c.worker === worker.name);
    const resolved = workerComplaints.filter(c => c.status === "resolved").length;
    const inprogress = workerComplaints.filter(c => c.status === "inprogress").length;
    const pending = workerComplaints.filter(c => c.status === "pending").length;
    const totalCost = workerComplaints.reduce((sum, c) => sum + Number(c.cost || 0), 0);
    const rated = workerComplaints.filter(c => c.rating);
    const avgRating = rated.length
      ? rated.reduce((sum, c) => sum + Number(c.rating), 0) / rated.length
      : null;

    return {
      ...worker,
      resolved,
      inprogress,
      pending,
      totalAssigned: workerComplaints.length,
      totalCost,
      avgRating,
      score: resolved + inprogress,
    };
  }).sort((a, b) => b.score - a.score || b.resolved - a.resolved);
  const maxWorkerScore = Math.max(...workerAnalytics.map(w => w.score), 1);

  useEffect(() => {
  fetchComplaints();
}, [view]);

  
  const [sortByPriority, setSortByPriority]= useState(false);
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
const fetchAnnouncements = async () => {
  setError("");
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/announcements", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed to load announcements.");
      setAnnouncements([]);
      return;
    }

    setAnnouncements(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    setError(err.message || "Network error while loading announcements.");
    setAnnouncements([]);
  }
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
      .admin-action-button {
        padding: 9px 16px;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 6px 14px rgba(25, 118, 210, 0.22);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .admin-action-button:hover {
        background: #1259a8;
        transform: translateY(-1px);
        box-shadow: 0 8px 16px rgba(25, 118, 210, 0.28);
      }
      .admin-back-button {
        margin: 14px 0 0 24px;
        padding: 8px 14px;
        background: #ffffff;
        color: #1f2937;
        border: 1px solid #d7dee8;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s ease, box-shadow 0.2s ease;
      }
      .admin-back-button:hover {
        background: #f4f7fb;
        box-shadow: 0 6px 12px rgba(15, 23, 42, 0.08);
      }
      .performance-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
        margin: 18px 0 24px;
      }
      .performance-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      }
      .performance-card h3 {
        margin: 0 0 4px;
        color: #172554;
      }
      .performance-card p {
        margin: 4px 0;
        color: #64748b;
      }
      .performance-bar {
        height: 8px;
        background: #e5e7eb;
        border-radius: 999px;
        overflow: hidden;
        margin-top: 12px;
      }
      .performance-bar span {
        display: block;
        height: 100%;
        background: linear-gradient(90deg, #16a34a, #1976d2);
      }
      .status-pill {
        display: inline-block;
        min-width: 34px;
        padding: 4px 8px;
        border-radius: 999px;
        text-align: center;
        font-weight: 700;
      }
      .status-pill.resolved {
        color: #166534;
        background: #dcfce7;
      }
      .status-pill.working {
        color: #075985;
        background: #e0f2fe;
      }
      .status-pill.pending {
        color: #92400e;
        background: #fef3c7;
      }
      `}</style>

      {/* Top Bar */}
      {view !== "dashboard" && (
  <button
    className="admin-back-button"
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
      {error && (
        <div style={{ color: "#b00020", textAlign: "center", margin: "0 auto", maxWidth: "900px" }}>
          {error}
        </div>
      )}

      {/* Dashboard */}
      {view === "dashboard" && (
  <>
  <div style={{ textAlign: "right", width: "90%", margin: "20px auto" }}>
  <button
    onClick={() => setView("workerPerformance")}
    className="admin-action-button"
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
  <div style={{ width: "90%", margin: "30px auto", display: "flex", flexDirection: "column", gap: "16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <div>
        <h2 style={{ margin: 0 }}>Worker Performance Analytics</h2>
        <p style={{ margin: "4px 0 0", color: "#64748b" }}>Comparing workers by resolved and currently working complaints.</p>
      </div>
      <div style={{ background: "#eff6ff", color: "#1d4ed8", padding: "8px 12px", borderRadius: "999px", fontWeight: 700 }}>
        {workerAnalytics.length} workers tracked
      </div>
    </div>
    <div className="performance-grid">
      {workerAnalytics.map((w, index) => (
        <div className="performance-card" key={w.name}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h3>{w.name}</h3>
            <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
              #{index + 1}
            </span>
          </div>
          <p>{w.category} Worker</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <div style={{ flex: 1, background: "#f0fdf4", padding: "8px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 700, color: "#166534" }}>{w.resolved}</div>
              <div style={{ fontSize: "12px", color: "#4b5563" }}>Resolved</div>
            </div>
            <div style={{ flex: 1, background: "#eff6ff", padding: "8px", borderRadius: "8px" }}>
              <div style={{ fontWeight: 700, color: "#1d4ed8" }}>{w.inprogress}</div>
              <div style={{ fontSize: "12px", color: "#4b5563" }}>Working</div>
            </div>
          </div>
          <div className="performance-bar">
            <span style={{ width: `${(w.score / maxWorkerScore) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
    <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}>
    <thead>
      <tr>
        <th>Worker</th>
        <th>Category</th>
        <th>Resolved</th>
        <th>Working</th>
        <th>Pending</th>
        <th>Total Assigned</th>
        <th>Avg Rating</th>
        <th>Total Cost</th>
      </tr>
    </thead>
    <tbody>
      {workerAnalytics.map(w => (
        <tr key={w.name}>
          <td><b>{w.name}</b></td>
          <td>{w.category}</td>
          <td><span className="status-pill resolved">{w.resolved}</span></td>
          <td><span className="status-pill working">{w.inprogress}</span></td>
          <td><span className="status-pill pending">{w.pending}</span></td>
          <td>{w.totalAssigned}</td>
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
