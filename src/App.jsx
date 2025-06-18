import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import logo from "./assets/C_logo.png";
import "./index.css";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const cleaned = results.data.map((row) => ({
          Name: row.Name?.trim(),
          checkedIn: false,
          manual: false
        }));
        setGuestList(cleaned);
      },
    });
  };

  const handleCheckIn = (index) => {
    const updatedGuests = [...guestList];
    updatedGuests[index].checkedIn = !updatedGuests[index].checkedIn;
    setGuestList(updatedGuests);
    setAttendanceCount(updatedGuests.filter((g) => g.checkedIn).length);
  };

  const handleAddGuest = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    const newGuest = {
      Name: `${firstName} ${lastName}`.trim(),
      checkedIn: false,
      manual: true,
    };
    setGuestList((prev) => [...prev, newGuest]);
    setFirstName("");
    setLastName("");
    setShowForm(false);
  };

  const filteredGuests = guestList.filter((guest) =>
    guest.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <img src={logo} alt="Convene Logo" className="logo" />
      <h1 className="title">Guest Check-In</h1>

      <div className="controls">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Search name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="plus-button" onClick={() => setShowForm(!showForm)}>
          +
        </button>
      </div>

      {showForm && (
        <div className="manual-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button onClick={handleAddGuest}>Add Guest</button>
        </div>
      )}

      <div className="attendance">
        Attendance: {attendanceCount} / {guestList.length}
      </div>

      <div className="guest-list">
        {filteredGuests.map((guest, index) => (
          <div
            key={index}
            className={`guest-card ${guest.checkedIn ? "checked" : ""} ${guest.manual ? "manual" : ""}`}
            onClick={() => handleCheckIn(index)}
          >
            {guest.Name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
