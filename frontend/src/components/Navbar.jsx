import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Calculator,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  User,
  UsersRound,
  X,
  ClipboardCheck,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const customerItems = [
    ["/dashboard", "Dashboard", LayoutDashboard],
    ["/plans", "Plans", FileText],
    ["/calculator", "Premium", Calculator],
    ["/policies", "My Policies", ClipboardCheck],
    ["/claims", "Claims", FileText],
  ];

  const adminItems = [
    ["/admin", "Overview", LayoutDashboard],
    ["/admin/plans", "Plans", FileText],
    ["/admin/policies", "Policies", ClipboardCheck],
    ["/admin/users", "Customers", UsersRound],
    ["/admin/cancellations", "Cancellations", Settings],
    ["/admin/claims", "Claims", ClipboardCheck],
  ];

  const homeTarget = user && isAdmin ? "/admin" : "/";

  return (
    <header className="topbar">
      <div className="nav-inner">
        <Link to={homeTarget} className="brand" onClick={close}>
          <img src="/brand-logo.png" alt="InsureHub" />
        </Link>

        {user && (
          <div className="nav-role">
            <ShieldCheck size={14} />
            {isAdmin ? "Administrator" : "Customer"}
          </div>
        )}

        <button
          className="menu-btn"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          {!user && (
            <>
              <NavLink to="/plans" onClick={close} className="nav-link">
                <FileText size={16} />
                Explore plans
              </NavLink>
              <div className="nav-auth">
                <Link to="/login" className="ghost-btn" onClick={close}>
                  <User size={15} />
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="primary-btn small"
                  onClick={close}
                >
                  Get started
                </Link>
              </div>
            </>
          )}

          {user &&
            (isAdmin ? adminItems : customerItems).map(
              ([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/admin" || to === "/dashboard"}
                  onClick={close}
                  className="nav-link"
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ),
            )}

          {user && (
            <>
              <NavLink to="/profile" onClick={close} className="nav-link">
                <User size={16} />
                Profile
              </NavLink>
              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  close();
                  nav("/login");
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
