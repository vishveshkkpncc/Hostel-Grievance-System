import { useEffect, useState } from "react";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

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
    <div style={{ padding: "20px" }}>
      <h2>📢 Announcements</h2>

      {announcements.length === 0 ? (
        <p>No announcements</p>
      ) : (
        <ul>
          {announcements.map(a => (
            <li key={a._id}>
              <b>{a.text}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAnnouncements;