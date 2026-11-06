
const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertBtn = document.getElementById("convertBtn");
const errorElement = document.getElementById("error");

const celsiusOutput = document.getElementById("celsius");
const fahrenheitOutput = document.getElementById("fahrenheit");
const kelvinOutput = document.getElementById("kelvin");

function validateInput() {
    const rawValue = temperatureInput.value.trim();
    const unit = unitSelect.value;

    temperatureInput.classList.remove("invalid");
    errorElement.textContent = "";

    if (rawValue === "") {
        showError("Please enter a temperature value.");
        return false;
    }

    // Allow integers and decimals, but reject letters and invalid formats.
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(rawValue)) {
        showError("Please enter a valid number.");
        return false;
    }

    const temperature = Number(rawValue);

    if (!Number.isFinite(temperature)) {
        showError("Please enter a valid finite number.");
        return false;
    }

    // Absolute-zero validation for the selected input unit.
    if (
        (unit === "C" && temperature < -273.15) ||
        (unit === "F" && temperature < -459.67) ||
        (unit === "K" && temperature < 0)
    ) {
        showError("Temperature cannot be below absolute zero.");
        return false;
    }

    return true;
}

function showError(message) {
    errorElement.textContent = message;
    temperatureInput.classList.add("invalid");
}

function clearResults() {
    celsiusOutput.textContent = "-- °C";
    fahrenheitOutput.textContent = "-- °F";
    kelvinOutput.textContent = "-- K";
}

function formatTemperature(value) {
    // Avoid displaying negative zero because of rounding.
    const rounded = Number(value.toFixed(2));
    return rounded.toFixed(2);
}

function convertTemperature() {
    if (!validateInput()) {
        clearResults();
        return;
    }

    const temperature = Number(temperatureInput.value.trim());
    const unit = unitSelect.value;

    let celsius;
    let fahrenheit;
    let kelvin;

    if (unit === "C") {
        celsius = temperature;
        fahrenheit = (temperature * 9 / 5) + 32;
        kelvin = temperature + 273.15;
    } else if (unit === "F") {
        celsius = (temperature - 32) * 5 / 9;
        fahrenheit = temperature;
        kelvin = celsius + 273.15;
    } else {
        kelvin = temperature;
        celsius = temperature - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;
    }

    celsiusOutput.textContent =
        `${formatTemperature(celsius)} °C`;

    fahrenheitOutput.textContent =
        `${formatTemperature(fahrenheit)} °F`;

    kelvinOutput.textContent =
        `${formatTemperature(kelvin)} K`;
}

// Real-time validation while typing or changing units.
temperatureInput.addEventListener("input", () => {
    clearResults();
    validateInput();
});

unitSelect.addEventListener("change", () => {
    clearResults();

    if (temperatureInput.value.trim() !== "") {
        validateInput();
    } else {
        errorElement.textContent = "";
        temperatureInput.classList.remove("invalid");
    }
});

// Convert only when the button is clicked.
convertBtn.addEventListener("click", convertTemperature);
