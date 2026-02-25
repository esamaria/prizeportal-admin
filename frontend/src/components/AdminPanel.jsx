import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =  "https://prizeportal-admin-production.up.railway.app/api/events";

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    firstPrize: [""],
    secondPrize: [""],
    thirdPrize: [""]
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get(API_BASE)
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch events. Please try again.");
      });
  };

  // Handle text change for dynamic fields
  const handlePrizeChange = (place, index, value) => {
    const updated = [...formData[place]];
    updated[index] = value;

    setFormData({
      ...formData,
      [place]: updated
    });
  };

  // Add new input field
  const addPrizeField = (place) => {
    setFormData({
      ...formData,
      [place]: [...formData[place], ""]
    });
  };

  // Remove field
  const removePrizeField = (place, index) => {
    const updated = formData[place].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [place]: updated.length ? updated : [""]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanData = {
      ...formData,
      firstPrize: formData.firstPrize.filter(name => name.trim() !== ""),
      secondPrize: formData.secondPrize.filter(name => name.trim() !== ""),
      thirdPrize: formData.thirdPrize.filter(name => name.trim() !== "")
    };

    const request = editId
      ? axios.put(`${API_BASE}/${editId}`, cleanData)
      : axios.post(API_BASE, cleanData);

    request.then(() => {
      fetchEvents();
      resetForm();
    }).catch(() => alert("Error saving event"));
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      itemName: "",
      firstPrize: [""],
      secondPrize: [""],
      thirdPrize: [""]
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE}/${id}`)
      .then(() => fetchEvents())
      .catch(() => alert("Error deleting event"));
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setFormData({
      itemName: event.itemName,
      firstPrize: event.firstPrize.length ? event.firstPrize : [""],
      secondPrize: event.secondPrize.length ? event.secondPrize : [""],
      thirdPrize: event.thirdPrize.length ? event.thirdPrize : [""]
    });
  };

  const renderPrizeInputs = (label, place) => (
    <div>
      <label style={styles.label} htmlFor={place}>{label}</label>

      {formData[place].map((value, index) => (
        <div key={index} style={styles.inputRow}>
          <input
            id={`${place}-${index}`}
            type="text"
            value={value}
            onChange={(e) =>
              handlePrizeChange(place, index, e.target.value)
            }
            style={styles.input}
            placeholder={`${label} Winner`}
          />

          <button
            type="button"
            onClick={() => addPrizeField(place)}
            style={styles.addBtn}
          >
            +
          </button>

          {formData[place].length > 1 && (
            <button
              type="button"
              onClick={() => removePrizeField(place, index)}
              style={styles.removeBtn}
            >
              −
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Event Name"
          value={formData.itemName}
          onChange={(e) =>
            setFormData({ ...formData, itemName: e.target.value })
          }
          style={styles.input}
          required
        />

        {renderPrizeInputs("First Prize", "firstPrize")}
        {renderPrizeInputs("Second Prize", "secondPrize")}
        {renderPrizeInputs("Third Prize", "thirdPrize")}

        <button type="submit" style={styles.submitBtn}>
          {editId ? "Update Event" : "Add Event"}
        </button>
      </form>

      <div style={styles.cardContainer}>
        {events.map(event => (
          <div key={event.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{event.itemName}</h3>

            <p>🥇 {event.firstPrize?.join(", ")}</p>
            <p>🥈 {event.secondPrize?.join(", ")}</p>
            <p>🥉 {event.thirdPrize?.join(", ")}</p>

            <div style={styles.buttonRow}>
              <button onClick={() => handleEdit(event)} style={styles.editBtn}>
                Edit
              </button>
              <button onClick={() => handleDelete(event.id)} style={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f3f6fd",
    padding: "60px 20px",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#1f2937"
  },
  form: {
    width: "100%",
    maxWidth: "550px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "50px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "5px",
    color: "#374151"
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px"
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px"
  },
  addBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  removeBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  submitBtn: {
    background: "#111827",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "500",
    cursor: "pointer"
  },
  cardContainer: {
    width: "100%",
    maxWidth: "600px",
    display: "grid",
    gap: "20px"
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px"
  },
  buttonRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px"
  },
  editBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default AdminPanel;
