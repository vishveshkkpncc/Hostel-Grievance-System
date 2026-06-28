import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Login/Home";
import Login from "./Login/Login";
import StudentApp from "./portals/student/StudentApp";
import WorkerApp from "./portals/worker/WorkerApp";
import AdminApp from "./portals/admin/AdminApp";
import { isAuthenticated, getUser } from "./utils/auth";

function App() {
  const ProtectedRoute = ({ children, role }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/" replace />;
    }

    const user = getUser();
    if (role && user?.role !== role) {
      return <Navigate to="/" replace />;
    }  

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      {/* Login Page */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Student Portal */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute role="student">
            <StudentApp />
          </ProtectedRoute>
        }
      />

      {/* Worker Portal */}
      <Route
        path="/worker/*"
        element={
          <ProtectedRoute role="worker">
            <WorkerApp />
          </ProtectedRoute>
        }
      />
      
      {/* Worker Portal Root (for backward compatibility) */}
      {/* <Route
        path="/worker"
        element={
          <ProtectedRoute role="worker">
            <Navigate to="/worker" replace />
          </ProtectedRoute>
        }
      /> */}

      {/* Admin Portal */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminApp />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;