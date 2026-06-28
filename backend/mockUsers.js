// Hardcoded mock users for development/testing
// Password: password123 (plain text for mock users)
const mockUsers = [
  {
    userId: "student1",
    password: "password123",
    role: "student",
    name: "Raj Kumar",
    hostel: "H1",
    room: "101",
    department: null,
    contactNumber: "9876543210"
  },
  {
    userId: "student2",
    password: "password123",
    role: "student",
    name: "Priya Singh",
    hostel: "H2",
    room: "205",
    department: null,
    contactNumber: "9876543211"
  },
  {
    userId: "worker_elec",
    password: "password123",
    role: "worker",
    name: "Arun Sharma",
    hostel: null,
    room: null,
    department: "Electrical",
    contactNumber: "9876543212"
  },
  {
    userId: "worker_civil",
    password: "password123",
    role: "worker",
    name: "Bhavesh Patel",
    hostel: null,
    room: null,
    department: "Civil",
    contactNumber: "9876543213"
  },
  {
    userId: "worker_lan",
    password: "password123",
    role: "worker",
    name: "Deepak Verma",
    hostel: null,
    room: null,
    department: "Lan",
    contactNumber: "9876543214"
  },
  {
    userId: "admin1",
    password: "password123",
    role: "admin",
    name: "Admin User",
    hostel: null,
    room: null,
    department: null,
    contactNumber: "9876543215"
  }
];

module.exports = mockUsers;
