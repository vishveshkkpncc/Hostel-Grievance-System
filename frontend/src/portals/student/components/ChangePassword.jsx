import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword(){
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if(newPassword !== confirm){
      setStatus({error: "New passwords do not match"});
      return;
    }

    try{
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || data.error || 'Failed');
      setStatus({success: data.message || 'Password changed'});
      setOldPassword(""); setNewPassword(""); setConfirm("");
    }catch(err){
      setStatus({error: err.message});
    }
  };

  return (
    <div className="student-subpage">
      <div className="student-subpage-header">
        <h2>Change Password</h2>
        <button className="student-back-btn" onClick={() => navigate("/student/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, background:'#fff', padding:20, borderRadius:16, boxShadow:'0 10px 22px rgba(15,23,42,0.08)' }}>
        <div style={{ marginBottom:12 }}>
          <label>Old Password</label>
          <input type="password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required style={{ width:'100%', padding:8, marginTop:6 }} />
        </div>
        <div style={{ marginBottom:12 }}>
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required style={{ width:'100%', padding:8, marginTop:6 }} />
        </div>
        <div style={{ marginBottom:12 }}>
          <label>Confirm New Password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required style={{ width:'100%', padding:8, marginTop:6 }} />
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button className="ui-btn submit-btn" type="submit">Change Password</button>
        </div>
        {status?.error && <p style={{ color:'red', marginTop:12 }}>{status.error}</p>}
        {status?.success && <p style={{ color:'green', marginTop:12 }}>{status.success}</p>}
      </form>
    </div>
  );
}
