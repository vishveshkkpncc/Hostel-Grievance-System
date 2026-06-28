const express = require("express");
const Complaint = require("../models/Complaint");
const { authenticate, authorize } = require("../middleware/auth");
const { isDBConnected } = require("../db");
const mockUsers = require("../mockUsers");

const router = express.Router();

const workers = mockUsers
  .filter(user => user.role === "worker")
  .map(user => ({
    name: user.name,
    department: user.department,
    available: true,
  }));

let mockComplaints = [];

const createMockId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const getComplaintId = complaint => String(complaint._id || complaint.id);

const findComplaints = async (query = {}) => {
  if (isDBConnected()) {
    return Complaint.find(query);
  }

  return mockComplaints.filter(complaint =>
    Object.entries(query).every(([key, value]) => complaint[key] === value)
  );
};

const countComplaints = async (query = {}) => {
  if (isDBConnected()) {
    return Complaint.countDocuments(query);
  }

  return (await findComplaints(query)).length;
};

const findComplaintById = async (id) => {
  if (isDBConnected()) {
    return Complaint.findById(id);
  }

  return mockComplaints.find(complaint => getComplaintId(complaint) === String(id));
};

const saveComplaint = async (complaint) => {
  if (isDBConnected()) {
    await complaint.save();
    return complaint;
  }

  const index = mockComplaints.findIndex(item => getComplaintId(item) === getComplaintId(complaint));
  if (index >= 0) {
    mockComplaints[index] = complaint;
  } else {
    mockComplaints.push(complaint);
  }

  return complaint;
};

async function autoAssignWorker(category) {
  const deptWorkers = workers.filter(w => w.department === category && w.available);

  if (deptWorkers.length === 0) return "Unassigned";

  let minLoad = Infinity;
  let chosenWorker = "Unassigned";

  for (let w of deptWorkers) {
    const activeCount = await countComplaints({
      worker: w.name,
      status: "inprogress",
    });

    if (activeCount < minLoad && activeCount < 3) {
      minLoad = activeCount;
      chosenWorker = w.name;
    }
  }

  return chosenWorker;
}

// Student raises complaints
router.post("/", authenticate, authorize("student"), async (req, res) => {
  try {
    const worker = await autoAssignWorker(req.body.category);

    const complaintData = {
      ...req.body,
      studentId: req.user.userId,
      status: "pending",
      worker,
      assignedOn: worker === "Unassigned" ? null : new Date(),
      registeredOn: new Date(),
    };

    const complaint = isDBConnected()
      ? new Complaint(complaintData)
      : { _id: createMockId(), ...complaintData };

    await saveComplaint(complaint);
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET complaints of one student
router.get("/student/:studentId", authenticate, async (req, res) => {
  try {
    let queryStudentId = req.params.studentId;
    
    // Students can only see their own complaints - enforce using authenticated user
    if (req.user.role === "student") {
      // Override the studentId with the authenticated user's ID for students
      queryStudentId = req.user.userId;
      
      // If they're trying to view someone else's complaints, reject it
      if (req.params.studentId !== req.user.userId) {
        return res.status(403).json({ message: "Forbidden - You can only view your own complaints" });
      }
    }
    // Admins can view any student's complaints using the URL parameter

    const complaints = await findComplaints({
      studentId: queryStudentId
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin fetches all complaints
router.get("/", authenticate, async (req, res) => {
  try {
    // Only admin can see all complaints
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const complaints = await findComplaints();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Worker gets their assigned complaints
router.get("/worker/:workerName", authenticate, authorize("worker"), async (req, res) => {
  try {
    const complaints = await findComplaints({
      worker: req.params.workerName
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Worker updates complaints
router.put("/:id", authenticate, authorize("worker", "admin"), async (req, res) => {
  try {
    const { status, cost, reason } = req.body;

    const complaint = await findComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Workers can only update their own assigned complaints
    if (req.user.role === "worker" && complaint.worker !== req.user.name) {
      return res.status(403).json({ message: "Forbidden" });
    }

    complaint.status = status;
    complaint.cost = cost;
    complaint.reason = reason;

    if (status === "resolved") {
      complaint.resolvedOn = new Date();
    }
    if (status === "inprogress" && !complaint.assignedOn) {
      complaint.assignedOn = new Date();
    }

    await saveComplaint(complaint);
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits rating
router.put("/:id/rate", authenticate, authorize("student"), async (req, res) => {
  try {
    const { rating } = req.body;

    const complaint = await findComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Students can only rate their own complaints
    if (complaint.studentId !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (complaint.status !== "resolved") {
      return res.status(400).json({ message: "Cannot rate unresolved complaint" });
    }

    if (complaint.rating) {
      return res.status(400).json({ message: "Already Rated" });
    }

    complaint.rating = Number(req.body.rating);
    await saveComplaint(complaint);

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Workers performance
router.get("/workers/performance", authenticate, authorize("admin"), async (req, res) => {
  try {
    if (!isDBConnected()) {
      const performanceByWorker = mockComplaints
        .filter(complaint => complaint.status === "resolved" && complaint.rating)
        .reduce((acc, complaint) => {
          if (!acc[complaint.worker]) {
            acc[complaint.worker] = {
              _id: complaint.worker,
              category: complaint.category,
              complaintsHandled: 0,
              totalRating: 0,
              totalCost: 0,
            };
          }

          acc[complaint.worker].complaintsHandled += 1;
          acc[complaint.worker].totalRating += Number(complaint.rating);
          acc[complaint.worker].totalCost += Number(complaint.cost || 0);
          return acc;
        }, {});

      return res.json(Object.values(performanceByWorker).map(worker => ({
        _id: worker._id,
        category: worker.category,
        complaintsHandled: worker.complaintsHandled,
        avgRating: worker.totalRating / worker.complaintsHandled,
        totalCost: worker.totalCost,
      })));
    }

    const data = await Complaint.aggregate([
      { $match: { status: "resolved", rating: { $exists: true } } },
      {
        $group: {
          _id: "$worker",
          category: { $first: "$category" },
          complaintsHandled: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          totalCost: { $sum: "$cost" },
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
