import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  

  return (
    <div className="main-container">
      <header className="header">
        <div className="logo">
          <h1>Dental Studio</h1>
        </div>
        <nav className="nav">
          <button onClick={() => navigate("/login")}>Enter Portal</button>
          <button onClick={() => navigate("/services")}>Services</button>
          <button onClick={() => navigate("/about")}>About Us</button>
          <button onClick={() => navigate("/contact")}>Contact</button>
        </nav>
      </header>

      <section className="hero">
        <h2>Your Perfect Smile, Our Commitment</h2>
        <p>Experience the best dental care at Dental Studio.</p>
        <button onClick={() => navigate("/appointment")}>Book an Appointment</button>
      </section>

      <footer className="footer">
        <p>© 2025 Dental Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Index;
