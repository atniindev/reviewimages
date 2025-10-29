import { useEffect, useState } from "react";
import ImageReviewer from "./components/ImageReviewer";

export default function App() {
  const [message, setMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/hello`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Backend not reachable"));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "0.5rem" }}>
      <h1>{message}</h1>
      <ImageReviewer />
    </div>
  );
}
