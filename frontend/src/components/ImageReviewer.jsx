import { useEffect, useState } from "react";

export default function ImageReviewer() {
  const [image, setImage] = useState(null);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchNextImage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/images/next`);
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Data received:", data);

      if (data.done) {
        setDone(true);
        setImage(null);
      } else {
        setImage(data);
        setLabel(""); // clear input for Correct button
      }
    } catch (err) {
      console.error("Failed to fetch image:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextImage();
  }, []);

  const handleConfirm = async () => {
    if (!image) return;
    try {
      await fetch(`${backendUrl}/api/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image_id: image.id, 
          label: image.suggested_label 
        }),
      });
      fetchNextImage();
    } catch (err) {
      console.error("Failed to confirm:", err);
    }
  };

  const handleCorrect = async () => {
    if (!image) return;
    if (!label.trim()) {
      alert("Please enter a label before clicking Correct.");
    return;
  }
    try {
      await fetch(`${backendUrl}/api/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image_id: image.id, 
          label 
        }),
      });
      fetchNextImage();
    } catch (err) {
      console.error("Failed to save correction:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (done) return <h2>✅ All images have been reviewed. Great job!</h2>;
  if (!image) return <p>No image to display.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "1rem auto", textAlign: "center" }}>
      <p>
        Suggested label: <strong>{image.suggested_label || "-"}</strong>
      </p>
      <p>
        Confidence: <strong>{image.confidence.toFixed(2)}</strong>
      </p>
      <button
        onClick={handleConfirm}
        style={{
          padding: "0.5rem 1rem",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Confirm
      </button>

      <img
        src={image.url}
        alt="to review"
        style={{ width: "100%", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginTop: "1rem" }}
      />
      <div style={{ marginTop: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>New label for this image:</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label if different"
          style={{ padding: "0.5rem", width: "60%", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={handleCorrect}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Correct
        </button>
      </div>
    </div>
  );
}
