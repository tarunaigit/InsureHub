import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import PremiumCalculator from "./pages/PremiumCalculator";
import PurchasePolicy from "./pages/PurchasePolicy";
import MyPolicies from "./pages/MyPolicies";
import PolicyDetails from "./pages/PolicyDetails";
import RenewPolicy from "./pages/RenewPolicy";
import CancelPolicy from "./pages/CancelPolicy";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCancellations from "./pages/AdminCancellations";
import AdminPlans from "./pages/AdminPlans";
import AdminUsers from "./pages/AdminUsers";
import AdminPolicies from "./pages/AdminPolicies";
import Profile from "./pages/Profile";
import ToastProvider from "./components/ToastProvider";
import Claims from "./pages/Claims";
import NewClaim from "./pages/NewClaim";
import AdminClaims from "./pages/AdminClaims";
export default function App() {
  return (
    <>
      <ToastProvider />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:id" element={<PlanDetails />} />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <PremiumCalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <PurchasePolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policies"
          element={
            <ProtectedRoute>
              <MyPolicies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policies/:id"
          element={
            <ProtectedRoute>
              <PolicyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policies/:id/renew"
          element={
            <ProtectedRoute>
              <RenewPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policies/:id/cancel"
          element={
            <ProtectedRoute>
              <CancelPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cancellations"
          element={
            <ProtectedRoute admin>
              <AdminCancellations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <ProtectedRoute admin>
              <AdminPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute admin>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/policies"
          element={
            <ProtectedRoute admin>
              <AdminPolicies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/claims"
          element={
            <ProtectedRoute admin>
              <AdminClaims />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claims"
          element={
            <ProtectedRoute>
              <Claims />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claims/new"
          element={
            <ProtectedRoute>
              <NewClaim />
            </ProtectedRoute>
          }
        />
      </Routes>
      <footer className="footer">
        <div>InsureHub</div>
        <span>
          Secure Today <b>•</b> Brighter Tomorrow
        </span>
        <small>
          Project simulation for education — not an actual insurance product.
        </small>
      </footer>
    </>
  );
}
