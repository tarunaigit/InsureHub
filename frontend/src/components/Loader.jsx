export default function Loader() {
  return (
    <div className="loader-wrap">
      <img className="loader-illustration" src="/loading-screen.png" alt="Loading InsureHub" />
      <div className="spinner" aria-hidden="true" />
      <span>Loading your InsureHub workspace…</span>
    </div>
  );
}
