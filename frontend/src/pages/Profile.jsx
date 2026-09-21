import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";
export default function Profile() {
  const { user } = useAuth();
  return (
    <main className="container narrow">
      <PageHeader
        eyebrow="Profile"
        title="Your account"
        subtitle="Basic account information used by InsureHub."
      />
      <div className="details-card profile-card">
        <div className="profile-avatar">
          <User />
        </div>
        <div className="profile-info">
          <Row icon={User} label="Name" value={user.name} />
          <Row icon={Mail} label="Email" value={user.email} />
          <Row
            icon={Phone}
            label="Phone"
            value={user.phone || "Not provided"}
          />
          <Row icon={ShieldCheck} label="Role" value={user.role} />
        </div>
      </div>
    </main>
  );
}
const Row = ({ icon: Icon, label, value }) => (
  <div className="profile-row">
    <Icon size={18} />
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  </div>
);
