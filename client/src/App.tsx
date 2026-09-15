import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Test from "./pages/Test";
import Result from "./pages/Result";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
