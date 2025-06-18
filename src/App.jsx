import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import logo from "./assets/C_logo.png";

function App() {
  const [guestList, setGuestList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedIn, setCheckedIn] = useState({});
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");

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
