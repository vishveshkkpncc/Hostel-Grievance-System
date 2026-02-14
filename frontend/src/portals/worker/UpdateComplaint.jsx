import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateComplaint.css";
import { getToken } from "../../utils/auth";

function UpdateComplaint() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Pending");
  const [cost, setCost] = useState("");
  const [reason, setReason] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    let normalizedStatus = status;
    if (status === "In Progress") normalizedStatus = "inprogress";
    if (status === "Resolved") normalizedStatus = "resolved";
    if (status === "Pending") normalizedStatus = "pending";

    const token = getToken();

    await fetch(`http://localhost:5000/api/complaints/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: normalizedStatus,
        cost,
        reason,
      }),
    });

    // After successful update, go back to the relevant worker complaints list
    navigate(`/worker/${type}`);
  };

  return (
    <div className="update-container">
      <h1>Update Complaint</h1>

      <form onSubmit={handleUpdate}>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <label>Cost:</label>
        <input value={cost} onChange={(e) => setCost(e.target.value)} />

        <label>Reason:</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateComplaint;
