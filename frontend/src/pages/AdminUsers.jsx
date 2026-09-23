import { useEffect, useState } from "react";
import { RefreshCw, UsersRound } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const [usersResponse, policiesResponse] = await Promise.all([
        adminApi.users(),
        adminApi.policies(),
      ]);

      const usersData = usersResponse.data;
      const policiesData = policiesResponse.data;

      const activeStatuses = ["ACTIVE", "RENEWED"];
      const policyCounts = {};

      policiesData.forEach((policy) => {
        if (!activeStatuses.includes(policy.status)) {
          return;
        }

        const email = policy.ownerEmail;

        if (email) {
          const key = email.toLowerCase();

          policyCounts[key] = (policyCounts[key] || 0) + 1;
        }
      });

      const usersWithPolicyCount = usersData.map((user) => ({
        ...user,
        policyCount: policyCounts[user.email?.toLowerCase()] || 0,
      }));

      setUsers(usersWithPolicyCount);
    } catch (e) {
      const message = e.response?.data?.message || "Unable to load customers.";

      setUsers([]);
      setError(message);

      toast.error(message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!users) {
    return (
      <main className="container">
        <Loader />
      </main>
    );
  }

  return (
    <main className="container">
      <PageHeader
        eyebrow="Admin"
        title="Customers"
        subtitle="Review registered customer accounts. Insurance discounts are configured per insurance plan."
        actions={
          <button className="outline-btn" onClick={load}>
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <ErrorBox error={error} />

      <div className="table-card">
        <div className="table-head">
          <span>Customer</span>
          <span>Customer's Email</span>
          <span>Phone</span>
          <span>Policies (Active/Renewed)</span>
          <span>Joined</span>
        </div>

        {users.map((user) => (
          <div className="table-row" key={user.id}>
            <span>
              <b>{user.name}</b>
            </span>

            <span>{user.email}</span>

            <span>{user.phone || "—"}</span>

            <span>{user.policyCount}</span>

            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        ))}

        {!users.length && (
          <div className="empty-card compact">
            <UsersRound size={22} />

            <h3>No customers found</h3>

            <p>There are no registered customer accounts yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
