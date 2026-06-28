import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/announcements", {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      }
    })
      .then(res => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
        else setAnnouncements([]);
      })
      .catch(() => setAnnouncements([]));
  }, []);

  return (
    <div className="student-subpage">
      <div className="student-subpage-header">
        <h2>Announcements</h2>
        <button className="student-back-btn" onClick={() => navigate("/student/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="empty-state">No announcements available right now.</div>
      ) : (
        <div className="announcement-list">
          {announcements.map(a => (
            <div className="announcement-card" key={a._id}>
              <div className="announcement-marker">Notice</div>
              <p>{a.text}</p>
              {a.createdAt && (
                <div className="announcement-meta">
                  Posted on {new Date(a.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentAnnouncements;
