import { useEffect, useState } from "react";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setProfile(null));
  }, []);

  if (profile === null) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Profile</h2>
      <div style={{ maxWidth: 700, background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
        <p><strong>Name:</strong> {profile.name || '-'}</p>
        <p><strong>User ID:</strong> {profile.userId || '-'}</p>
        <p><strong>Role:</strong> {profile.role || '-'}</p>
        <p><strong>Department:</strong> {profile.department || '-'}</p>
        <p><strong>Hostel:</strong> {profile.hostel || '-'}</p>
        <p><strong>Room:</strong> {profile.room || '-'}</p>
        <p><strong>Contact:</strong> {profile.contactNumber || '-'}</p>
      </div>
    </div>
  );
}
