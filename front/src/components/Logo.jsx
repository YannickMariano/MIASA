export function Logo({ compact = false }) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`}>
      <img
        className="logo-image"
        src="/images/logo.png"
        alt="M'IASA"
      />
    </div>
  );
}
