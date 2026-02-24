import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://prizeportal-admin-production.up.railway.app/api/events";

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    firstPrize: [""],
    secondPrize: [""],
    thirdPrize: [""]
  });

  useEffect(function () {
    fetchEvents();
  }, []);

  function fetchEvents() {
    axios
      .get(API_BASE)
      .then(function (res) {
        setEvents(res.data);
      })
      .catch(function (err) {
        console.error(err);
        alert("Failed to fetch events.");
      });
  }

  function handlePrizeChange(place, index, value) {
    var updated = formData[place].slice();
    updated[index] = value;

    setFormData({
      ...formData,
      [place]: updated
    });
  }

  function addPrizeField(place) {
    setFormData({
      ...formData,
      [place]: formData[place].concat("")
    });
  }

  function removePrizeField(place, index) {
    var updated = formData[place].filter(function (_, i) {
      return i !== index;
    });

    setFormData({
      ...formData,
      [place]: updated.length > 0 ? updated : [""]
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    var cleanData = {
      itemName: formData.itemName,
      firstPrize: formData.firstPrize.filter(function (name) {
        return name.trim() !== "";
      }),
      secondPrize: formData.secondPrize.filter(function (name) {
        return name.trim() !== "";
      }),
      thirdPrize: formData.thirdPrize.filter(function (name) {
        return name.trim() !== "";
      })
    };

    var request;

    if (editId) {
      request = axios.put(API_BASE + "/" + editId, cleanData);
    } else {
      request = axios.post(API_BASE, cleanData);
    }

    request
      .then(function () {
        fetchEvents();
        resetForm();
      })
      .catch(function () {
        alert("Error saving event");
      });
  }

  function resetForm() {
    setEditId(null);
    setFormData({
      itemName: "",
      firstPrize: [""],
      secondPrize: [""],
      thirdPrize: [""]
    });
  }

  function handleDelete(id) {
    axios
      .delete(API_BASE + "/" + id)
      .then(function () {
        fetchEvents();
      })
      .catch(function () {
        alert("Error deleting event");
      });
  }

  function handleEdit(event) {
    setEditId(event.id);
    setFormData({
      itemName: event.itemName,
      firstPrize:
        event.firstPrize && event.firstPrize.length > 0
          ? event.firstPrize
          : [""],
      secondPrize:
        event.secondPrize && event.secondPrize.length > 0
          ? event.secondPrize
          : [""],
      thirdPrize:
        event.thirdPrize && event.thirdPrize.length > 0
          ? event.thirdPrize
          : [""]
    });
  }

  function renderPrizeInputs(label, place) {
    return (
      <div>
        <label style={styles.label}>{label}</label>

        {formData[place].map(function (value, index) {
          return (
            <div key={index} style={styles.inputRow}>
              <input
                type="text"
                value={value}
                onChange={function (e) {
                  handlePrizeChange(place, index, e.target.value);
                }}
                style={styles.input}
                placeholder={label + " Winner"}
              />

              <button
                type="button"
                onClick={function () {
                  addPrizeField(place);
                }}
                style={styles.addBtn}
              >
                +
              </button>

              {formData[place].length > 1 && (
                <button
                  type="button"
                  onClick={function () {
                    removePrizeField(place, index);
                  }}
                  style={styles.removeBtn}
                >
                  −
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Event Name"
          value={formData.itemName}
          onChange={function (e) {
            setFormData({ ...formData, itemName: e.target.value });
          }}
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
        {events.map(function (event) {
          return (
            <div key={event.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{event.itemName}</h3>

              <p>🥇 {(event.firstPrize || []).join(", ")}</p>
              <p>🥈 {(event.secondPrize || []).join(", ")}</p>
              <p>🥉 {(event.thirdPrize || []).join(", ")}</p>

              <div style={styles.buttonRow}>
                <button
                  onClick={function () {
                    handleEdit(event);
                  }}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={function () {
                    handleDelete(event.id);
                  }}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f3f6fd",
    padding: "60px 20px",
    fontFamily: "Poppins, sans-serif",
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
