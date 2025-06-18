
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import logo from "./assets/C_logo.png";
import "./index.css";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const formattedData = results.data.map((row) => ({
          firstName: row.FirstName?.trim(),
          lastName: row.LastName?.trim(),
          email: row.Email?.trim(),
          checkedIn: false,
          manual: false
        }));
        setGuestList(formattedData);
      },
    });
  };

  const toggleCheckIn = (index) => {
    const updatedList = [...guestList];
    updatedList[index].checkedIn = !updatedList[index].checkedIn;
    setGuestList(updatedList);
  };

  const addManualGuest = () => {
    const firstName = prompt("Enter first name:");
    const lastName = prompt("Enter last name:");
    if (firstName && lastName) {
      const newGuest = {
        firstName,
        lastName,
        email: \`\${firstName.toLowerCase()}.\${lastName.toLowerCase()}@manual.com\`,
        checkedIn: false,
        manual: true
      };
      setGuestList([...guestList, newGuest]);
    }
  };

  const filteredGuests = guestList.filter((guest) =>
    \`\${guest.firstName} \${guest.lastName}\`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = guestList.filter((g) => g.checkedIn).length;
  const attendanceRate = guestList.length ? ((checkedInCount / guestList.length) * 100).toFixed(1) : 0;

  return (
    <div className="container">
      <img src={logo} alt="Convene Logo" className="logo" />
      <h1>Guest Check-In</h1>
      <div className="controls">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Search name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-manual" onClick={addManualGuest}>+</button>
      </div>
      <p>Attendance Rate: {attendanceRate}%</p>
      <ul className="guest-list">
        {filteredGuests.map((guest, index) => (
          <li
            key={index}
            className={\`guest-item \${guest.checkedIn ? "checked-in" : ""} \${guest.manual ? "manual" : ""}\`}
            onClick={() => toggleCheckIn(index)}
          >
            {guest.firstName} {guest.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
