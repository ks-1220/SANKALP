document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map').setView([20.5937, 78.9629], 5); // Default India view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    function updateMap(hospitals) {
        map.eachLayer(layer => {
            if (!!layer.toGeoJSON) map.removeLayer(layer);
        });

        hospitals.forEach(h => {
            L.marker([h.latitude, h.longitude])
                .addTo(map)
                .bindPopup(`<b>${h.name}</b><br>Equipment: ${h.equipment.join(", ")}`);
        });

        if (hospitals.length > 0) {
            map.setView([hospitals[0].latitude, hospitals[0].longitude], 10);
        }
    }

    window.updateMap = updateMap; // Expose function globally
});
