document.getElementById("location-mode").addEventListener("change", function () {
    let manualInput = document.getElementById("manual-location");
    let detectBtn = document.getElementById("detect-location");

    if (this.value === "manual") {
        manualInput.style.display = "block";
        detectBtn.style.display = "none";
    } else {
        manualInput.style.display = "none";
        detectBtn.style.display = "block";
    }
});

document.getElementById("detect-location").addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        window.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
    }, function (error) {
        alert("Error getting location");
    });
});
