import { useEffect, useState } from "react";
import StarRating from "./StarRating";

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const studentId = localStorage.getItem("studentId"); // roll number
 const [ratings, setRatings] = useState({});

const submitRating = async (complaintId) => {
  const rating = ratings[complaintId];

  if (!rating) {
    alert("Please select a rating");
    return;
  }

  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:5000/api/complaints/${complaintId}/rate`,
    {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ rating }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    alert(err.message || "Failed to submit rating");
    return;
  }

  alert("Thank You For Your Feedback!");

  // 🔒 freeze rating UI for this complaint
  setRatings(prev => {
    const copy = { ...prev };
    delete copy[complaintId];
    return copy;
  });

  fetchComplaints(); // refresh from backend
};
    const fetchComplaints = () => {
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/complaints/student/${studentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          console.error("Error fetching complaints:", res.status);
          return [];
        }
        return res.json();
      })
      .then(data => setComplaints(data || []))
      .catch(err => {
        console.error("Error:", err);
        setComplaints([]);
      });
  };
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token");

    if (!studentId || !token) {
      setComplaints([]);
      return;
    }

    fetch(`http://localhost:5000/api/complaints/student/${studentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          console.error("Error fetching complaints:", res.status);
          return [];
        }
        return res.json();
      })
      .then(data => setComplaints(data || []))
      .catch(err => {
        console.error("Error:", err);
        setComplaints([]);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        complaints.map(c => (
          <div
            key={c._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px"
            }}
          >
            <p><b>Issue:</b> {c.issueType}</p>
            <p><b>Category:</b> {c.category}</p>
            <p><b>Status:</b> {c.status}</p>
            {c.status === "resolved" && c.rating == null && (
            <>
              <h4>Rate the worker</h4>
              <StarRating rating={ratings[c._id] || 0} 
              setRating={(value) =>setRatings(prev => ({ ...prev,[c._id]:value}))} />
              <button onClick={() =>submitRating(c._id)}>Submit Rating</button>
            </>
            )}
            {c.status === "resolved" && c.rating != null && (
            <>
              <h4>Your Rating</h4>
              <StarRating rating={c.rating} readOnly={true} />
            </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ViewComplaints;