export function Icon({ name, fill = false, size, className = "", style }) {
  return (
    <span
      aria-hidden="true"
      className={`ms ${fill ? "ms-fill" : ""} ${className}`}
      style={size ? { fontSize: size, ...style } : style}
    >
      {name}
    </span>
  );
}
