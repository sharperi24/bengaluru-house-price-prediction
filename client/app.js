const API_BASE = "https://<YOUR_RENDER_BACKEND_URL>";

function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1; // Invalid Value
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = document.getElementById("uiSqft").value;
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations").value;
    var estPrice = document.getElementById("uiEstimatedPrice");

    var url = "https://<your-backend-service>.onrender.com/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location
    }, function(data, status) {
        console.log("Response:", data);
        if (data && data.estimated_price !== undefined) {
            estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
        } else {
            estPrice.innerHTML = "<h2>Error in prediction</h2>";
        }
    }).fail(function(err) {
        console.error("Request failed:", err);
        estPrice.innerHTML = "<h2>Server error</h2>";
    });
}

function onPageLoad() {
    console.log("document loaded");

    var url = "https://<your-backend-service>.onrender.com/get_location_names";

    $.get(url, function(data, status) {
        console.log("Got response for get_location_names request:", data);
        if (data && data.locations) {
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for (var i in data.locations) {
                var opt = new Option(data.locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    }).fail(function(err) {
        console.error("Failed to load locations:", err);
    });
}

window.onload = onPageLoad;
