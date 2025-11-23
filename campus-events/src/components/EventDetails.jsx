import "../styles/details.css";

export function EventDetails() {
  return (
    <div className="details-container">
      <img src="/img/hackathon.jpg" className="banner" />

      <h2>Inter-College Hackathon 2025</h2>
      <p className="date">📅 23 Feb 2025</p>

      <p className="description">
        Join the biggest hackathon of the year! Teams will compete to build
        innovative solutions.
      </p>

      <button className="register-btn">Register Now</button>
    </div>
  );
}
