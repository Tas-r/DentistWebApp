import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="index-page">
      <h1>Welcome to the Dental Portal</h1>
      <button onClick={() => navigate("/login")}>Enter Portal</button>
    </div>
  );
}

export default Index;
