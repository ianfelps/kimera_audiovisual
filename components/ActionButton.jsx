export default function ActionButton({ icon, value, className }) {
  return (
    <button className={`btn mx-1 ${className}`} type="button">
      <i className={`bi ${icon} h4`} />
      <span className="h5">&nbsp;&nbsp;{value}</span>
    </button>
  );
}
