function updateHospitalTable(hospitals) {
    let tbody = document.querySelector("#hospital-table tbody");
    tbody.innerHTML = "";

    hospitals.forEach(h => {
        let row = `<tr>
            <td>${h.name}</td>
            <td>${h.equipment.join(", ")}</td>
            <td>${h.condition}</td>
            <td>${h.contact}</td>
            <td>${h.distance.toFixed(2)} km</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

window.updateHospitalTable = updateHospitalTable; // Expose globally
