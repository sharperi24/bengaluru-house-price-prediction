const API_BASE = "https://bengaluru-house-price-prediction-3-atax.onrender.com";


function getBathValue() {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) return parseInt(i) + 1;
    }
    return -1;
}

function getBHKValue() {
    const uiBHK = document.getElementsByName("uiBHK");
    for (let i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) return parseInt(i) + 1;
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    const sqft = document.getElementById("uiSqft").value;
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations").value;
    const estPrice = document.getElementById("uiEstimatedPrice");

    $.ajax({
        url: API_BASE + "/predict_home_price",
        type: 'POST',
        data: JSON.stringify({
            total_sqft: parseFloat(sqft),
            bhk: bhk,
            bath: bathrooms,
            location: location
        }),
        contentType: 'application/json',
        success: function(data) {
            estPrice.innerHTML = "<h2>" + data.estimated_price + " Lakh</h2>";
        },
        error: function(err) {
            console.error(err);
            estPrice.innerHTML = "<h2>Server error</h2>";
        }
    });
}

function onPageLoad() {
    console.log("Document loaded");
    $.get(API_BASE + "/get_location_names", function(data, status) {
        if (data) {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            $('#uiLocations').append('<option value="" disabled selected>Choose a Location</option>');
            for (let i in locations) {
                const opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
}

window.onload = onPageLoad;
