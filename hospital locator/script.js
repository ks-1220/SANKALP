document.getElementById("search").addEventListener("click", async function () {
    let equipment = document.getElementById("equipment").value;
    let sortBy = document.getElementById("sort").value;

    // Step 1: Get User's Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            let userLat = position.coords.latitude;
            let userLon = position.coords.longitude;

            console.log(`User Location: ${userLat}, ${userLon}`);

            // Step 2: Fetch Hospitals Near User Location
            let apiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${userLat},${userLon})["amenity"="hospital"];out;`;
            
            try {
                let response = await fetch(apiUrl);
                let data = await response.json();
                
                console.log("Fetched Data:", data);

                if (!data.elements || data.elements.length === 0) {
                    alert("No hospitals found nearby. Try increasing the search radius.");
                    return;
                }

                let hospitalData = data.elements.map(h => ({
                    name: h.tags?.name || "Unknown Hospital",
                    latitude: h.lat,
                    longitude: h.lon,
                    equipment: ["ECG", "Beds", "Oxygen"], // Placeholder data
                    condition: "Good",
                    contact: h.tags?.phone || "Not Available",
                    distance: getDistance(userLat, userLon, h.lat, h.lon) // Calculate actual distance
                }));

                console.log("Processed Hospital Data:", hospitalData);

                // Step 3: Sort Hospitals by Distance or Equipment
                if (sortBy === "nearest") {
                    hospitalData.sort((a, b) => a.distance - b.distance);
                }

                // Step 4: Update UI (Table & Map)
                updateHospitalTable(hospitalData);
                updateMap(hospitalData);
            } catch (error) {
                console.error("Error fetching hospital data:", error);
                alert("Failed to fetch hospital data. Please try again later.");
            }
        }, () => {
            alert("Location access denied. Please allow location access.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Function to Calculate Distance between Two Coordinates (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
}

// Function to Update Table
function updateHospitalTable(hospitals) {
    let tableBody = document.querySelector("#hospital-table tbody");
    tableBody.innerHTML = ""; // Clear existing table data

    hospitals.forEach(hospital => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${hospital.name}</td>
            <td>${hospital.equipment.join(", ")}</td>
            <td>${hospital.condition}</td>
            <td>${hospital.contact}</td>
            <td>${hospital.distance} km</td>
        `;

        tableBody.appendChild(row);
    });
}
