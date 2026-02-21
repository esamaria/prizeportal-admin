import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMedal } from "react-icons/fa";

function StudentView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/api/events")
      .then(response => {
        console.log("API data:", response.data); // debug to check data
        setEvents(response.data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const renderWinners = (winners) => {
    if (!winners) return <p style={styles.winner}>—</p>;

    // Ensure winners is an array
    const winnerArray = Array.isArray(winners) ? winners : [winners];

    return winnerArray.length === 0
      ? <p style={styles.winner}>—</p>
      : winnerArray.map((name, index) => (
          <p key={index} style={styles.winner}>• {name}</p>
        ));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>College Event Results</h1>
        <p style={styles.subtitle}>Recognizing outstanding achievements</p>
      </div>

      <div style={styles.grid}>
        {events.map(event => (
          <div key={event.id} style={styles.card}>
            
            <div style={styles.cardHeader}>
              <h2 style={styles.eventName}>{event.itemName}</h2>
            </div>

            <div style={styles.prizeContainer}>
              
              <div style={{ ...styles.prizeBadge, ...styles.gold }}>
                <FaMedal size={20} />
                <div>
                  <span style={styles.label}>First Prize</span>
                  {renderWinners(event.firstPrize)}
                </div>
              </div>

              <div style={{ ...styles.prizeBadge, ...styles.silver }}>
                <FaMedal size={20} />
                <div>
                  <span style={styles.label}>Second Prize</span>
                  {renderWinners(event.secondPrize)}
                </div>
              </div>

              <div style={{ ...styles.prizeBadge, ...styles.bronze }}>
                <FaMedal size={20} />
                <div>
                  <span style={styles.label}>Third Prize</span>
                  {renderWinners(event.thirdPrize)}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #f0f9ff, #e0f2fe)",
    padding: "70px 20px",
    fontFamily: "'Poppins', sans-serif"
  },

  header: {
    textAlign: "center",
    marginBottom: "60px"
  },

  title: {
    fontSize: "34px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "10px"
  },

  subtitle: {
    fontSize: "16px",
    color: "#64748b"
  },

  grid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "35px"
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease"
  },

  cardHeader: {
    marginBottom: "25px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "15px"
  },

  eventName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2563eb"
  },

  prizeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  prizeBadge: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "15px",
    borderRadius: "14px",
    fontSize: "14px"
  },

  label: {
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase"
  },

  winner: {
    margin: "4px 0 0 0",
    fontSize: "15px",
    fontWeight: "500"
  },

  gold: {
    backgroundColor: "#fff7e6",
    color: "#b45309"
  },

  silver: {
    backgroundColor: "#f1f5f9",
    color: "#475569"
  },

  bronze: {
    backgroundColor: "#fdf2f2",
    color: "#92400e"
  }
};

export default StudentView;