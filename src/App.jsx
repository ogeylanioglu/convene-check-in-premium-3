import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import logo from "./assets/C_logo.png";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedIn, setCheckedIn] = useState({});
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [manualName, setManualName] = useState("");

  useEffect(() => {
    const savedList = localStorage.getItem("guestList");
    const savedCheckIns = localStorage.getItem("checkedIn");
    if (savedList) setGuestList(JSON.parse(savedList));
    if (savedCheckIns) setCheckedIn(JSON.parse(savedCheckIns));
  }, []);

  useEffect(() => {
    localStorage.setItem("guestList", JSON.stringify(guestList));
  }, [guestList]);

  useEffect(() => {
    localStorage.setItem("checkedIn", JSON.stringify(checkedIn));
  }, [checkedIn]);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleaned = results.data.map(row => ({
          Name: row.Name?.trim(),
          manual: false
        })).filter(row => row.Name);
        setGuestList(cleaned);
        setCheckedIn({});
        localStorage.setItem("guestList", JSON.stringify(cleaned));
        localStorage.setItem("checkedIn", JSON.stringify({}));
      },
    });
  };

  const toggleCheckIn = (name) => {
    const updated = { ...checkedIn, [name]: !checkedIn[name] };
    setCheckedIn(updated);
  };

  const clearData = () => {
    setGuestList([]);
    setCheckedIn({});
    localStorage.clear();
  };

  const filteredGuests = guestList
    .filter((guest) =>
      guest.Name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.Name.localeCompare(b.Name)
        : b.Name.localeCompare(a.Name)
    );

  const total = guestList.length;
  const checked = Object.values(checkedIn).filter(Boolean).length;
  const percentage = total > 0 ? ((checked / total) * 100).toFixed(1) : 0;

  const handleAddManual = () => {
    if (!manualName.trim()) return;
    const newGuest = { Name: manualName.trim(), manual: true };
    setGuestList(prev => [...prev, newGuest]);
    setManualName("");
    setShowModal(false);
  };

  return (
    <div className="wrapper">
      <header className="hero">
        <img src={logo} alt="Convene Logo" className="logo" />
        <h1>Elevate Your Check-In Process</h1>
        <p className="subtitle">A seamless, modern experience built for every Convene location.</p>
      </header>

      <div className="controls">
        <div className="upload-wrapper">
          <label htmlFor="csvUpload" className="upload-label">Upload Guest List (.csv)</label>
          <input
            type="file"
            id="csvUpload"
            className="hidden-input"
            accept=".csv"
            onChange={handleCSVUpload}
          />
        </div>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search by full name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSearchTerm("")}>Clear</button>
          <button onClick={clearData}>Reset All</button>
          <button onClick={() => setSortAsc((prev) => !prev)}>
            Sort {sortAsc ? "↓ Z-A" : "↑ A-Z"}
          </button>
          <button onClick={() => setShowModal(true)}>＋</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-box">
          Attendance Rate: {percentage}%
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="stat-box">Checked in: {checked} / {total}</div>
      </div>

      <div className="guest-grid">
        {filteredGuests.map((guest, idx) => (
          <div
            key={idx}
            onClick={() => toggleCheckIn(guest.Name)}
            className={`guest-card ${checkedIn[guest.Name] ? "checked" : ""} ${guest.manual ? "manual" : ""}`}
          >
            <div className="guest-top">
              <span className="guest-name">{guest.Name}</span>
              <span className={`tag ${checkedIn[guest.Name] ? "green" : "red"}`}>
                {checkedIn[guest.Name] ? "Checked In" : "Not Checked In"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Guest</h3>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="Full name"
            />
            <div className="modal-buttons">
              <button onClick={handleAddManual}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
