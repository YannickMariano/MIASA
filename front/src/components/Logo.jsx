export function Logo({ compact = false }) {
  return <div className="logo"><span className="logo-mark">T</span>{!compact && <span>Tanimboly<small>Smart agriculture</small></span>}</div>
}
