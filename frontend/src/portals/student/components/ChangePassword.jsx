import { useState } from "react";

export default function ChangePassword(){
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);

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
    <div style={{ padding: 20 }}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, background:'#fff', padding:20, borderRadius:8 }}>
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
