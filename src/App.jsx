import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import logo from "./assets/C_logo.png";
import background from "./assets/background.jpg";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedIn, setCheckedIn] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");

  useEffect(() => {
    const storedCheckins = localStorage.getItem("checkedIn");
    if (storedCheckins) {
      setCheckedIn(JSON.parse(storedCheckins));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checkedIn", JSON.stringify(checkedIn));
  }, [checkedIn]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const guests = results.data.map((row, index) => ({
          id: row.ID || index,
          Name: row.Name?.trim(),
          manual: false
        }));
        setGuestList(guests);
      },
    });
  };

  const handleCheckIn = (id) => {
    setCheckedIn((prev) => {
      const newCheckIn = { ...prev, [id]: !prev[id] };
      localStorage.setItem("checkedIn", JSON.stringify(newCheckIn));
      return newCheckIn;
    });
  };

  const filteredGuests = guestList.filter((guest) =>
    guest.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGuest = () => {
    if (!newGuestName.trim()) return;
    const newGuest = {
      id: `manual-${Date.now()}`,
      Name: newGuestName.trim(),
      manual: true,
    };
    setGuestList((prev) => [...prev, newGuest]);
    setNewGuestName("");
    setShowForm(false);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="overlay">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">Guest Check-In</h1>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-upload"
        />
        <input
          type="text"
          placeholder="Search name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <div className="guest-list">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className={`guest-item ${checkedIn[guest.id] ? "checked-in" : ""}`}
              onClick={() => handleCheckIn(guest.id)}
            >
              {guest.Name}
              {guest.manual && <span className="manual-tag">Manual Entry</span>}
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          +
        </button>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <input
                type="text"
                placeholder="Enter guest name"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
              />
              <button onClick={handleAddGuest}>Add Guest</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
