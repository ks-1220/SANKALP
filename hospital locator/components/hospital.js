async function fetchHospitals(lat, lon) {
    const radius = 5000; // 5km range
    const apiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:${radius},${lat},${lon});out;`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API request failed");
        const data = await response.json();

        const hospitals = data.elements.map(hospital => ({
            name: hospital.tags.name || "Unnamed Hospital",
            lat: hospital.lat,
            lon: hospital.lon,
            equipment: extractEquipment(hospital.tags),
            distance: getDistance(lat, lon, hospital.lat, hospital.lon),
            phone: hospital.tags.phone || "N/A",
            website: hospital.tags.website || "#"
        }));

        displayHospitals(hospitals);
    } catch (error) {
        console.error("Error fetching hospital data", error);
    }
}

function extractEquipment(tags) {
    const equipmentList = [
        "oxygen_cylinders",
        "ecg_machines",
        "ventilators",
        "icu_beds",
        "xray_machines"
    ];

    let availableEquipment = equipmentList
        .filter(eq => tags[eq] !== undefined)
        .map(eq => eq.replace("_", " ").toUpperCase());

    return availableEquipment.length > 0 ? availableEquipment.join(", ") : "General Equipment";
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
}

function displayHospitals(hospitals) {
    const urgency = document.getElementById("urgency").value;
    
    if (urgency === "closest") {
        hospitals.sort((a, b) => a.distance - b.distance);
    } else {
        hospitals.sort((a, b) => b.equipment.length - a.equipment.length);
    }

    populateTable(hospitals);
    updateMapMarkers(hospitals);
}

// 📌 Auto-Detect User's Location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => fetchHospitals(position.coords.latitude, position.coords.longitude),
            () => console.log("Geolocation access denied, enter manually.")
        );
    }
}

// 📌 Manually Entered Location (With Autocomplete)
async function getCoordinatesFromAddress(address) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            fetchHospitals(lat, lon);
        } else {
            console.error("Location not found");
        }
    } catch (error) {
        console.error("Error fetching coordinates", error);
    }
}

// 📌 Event Listeners for Search Functionality
document.getElementById("searchButton").addEventListener("click", () => {
    const enteredLocation = document.getElementById("locationInput").value;
    if (enteredLocation) {
        getCoordinatesFromAddress(enteredLocation);
    } else {
        getUserLocation();
    }
});

// 🚀 Auto-fetch hospitals when page loads
document.addEventListener("DOMContentLoaded", getUserLocation);
