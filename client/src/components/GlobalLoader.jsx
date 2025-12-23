import "./GlobalLoader.css";

export default function GlobalLoader({ show }) {
  return (
    <div className={`global-loader ${show ? "show" : "hide"}`}>
      <div className="loader-box">
        {/* loader element goes here */}
        <div className="spinner" />
      </div>
    </div>
  );
}