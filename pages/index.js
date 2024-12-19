import { useState, useEffect } from "react";

export default function Home() {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [licensePlate, setLicensePlate] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerContact, setOwnerContact] = useState("");

  useEffect(() => {
    const fetchParkingSpots = async () => {
      const response = await fetch("/api/parking-spots");
      const data = await response.json();
      setParkingSpots(data);
    };

    fetchParkingSpots();
  }, []);

  const handlePark = async (spotId) => {
    if (!licensePlate.trim() || !ownerName.trim()) {
      alert("Please enter both license plate and owner name.");
      return;
    }

    try {
      const response = await fetch(`/api/park/${spotId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licensePlate, ownerName, ownerContact }),
      });

      if (response.ok) {
        alert("Vehicle parked successfully!");
        fetchParkingSpots();
        setLicensePlate("");
        setOwnerName("");
        setOwnerContact("");
      } else {
        const errorData = await response.json();
        alert("Parking failed: " + errorData.error);
      }
    } catch (error) {
      console.error("Error parking:", error);
      alert("An error occurred while parking the vehicle.");
    }
  };

  const handleRetrieve = async () => {
    try {
      const response = await fetch("/api/retrieve", {
        method: "POST",
        body: JSON.stringify({ licensePlate }),
      });

      if (response.ok) {
        console.log("Vehicle retrieved successfully!");
        setLicensePlate("");
        alert("Vehicle retrieved successfully.");
        fetchParkingSpots();
      } else {
        const errorData = await response.json();
        console.error("Retrieval failed:", errorData);
        alert("Retrieval failed: " + errorData.error);
      }
    } catch (error) {
      console.error("Error retrieving vehicle:", error);
      alert("An error occurred while retrieving the vehicle.");
    }
  };

  return (
    <div>
      <h1>Database and Info Systems: Parking Lot System</h1>
      <br></br>
      <h2>Available Parking Spots</h2>
      <ul>
        {parkingSpots.map((spot) => (
          <li key={spot.id}>
            Spot Number: {spot.spotNumber}
            <button onClick={() => handlePark(spot.id)}>Park</button>
          </li>
        ))}
      </ul>
      <br></br>

      <h2>Park Vehicle</h2>
      <input
        type="text"
        placeholder="Enter License Plate"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Owner Contact (optional)"
        value={ownerContact}
        onChange={(e) => setOwnerContact(e.target.value)}
      />
      <button onClick={() => handlePark()}>Park Vehicle</button>
      <br></br>

      <h2>Retrieve Vehicle</h2>
      <input
        type="text"
        placeholder="Enter License Plate"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
      />
      <button onClick={handleRetrieve}>Retrieve</button>
    </div>
  );
}
