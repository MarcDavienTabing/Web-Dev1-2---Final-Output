// ---------- Comments (demo only: stored in memory, resets on refresh) ----------

const commentForm = document.getElementById("commentForm");
const commentList = document.getElementById("commentList");
const message = document.getElementById("message");

// Demo comments shown when the page opens
const comments = [
    { username: "burgerfan_21", body: "The Beef Bacon Burger is huge. Worth every peso!" },
    { username: "maria.g", body: "Crispy fries and the chocolate milkshake was so good." },
    { username: "kuya_rico", body: "Fast pickup order, and the burger was still hot." }
];

// Build one comment and add it to the top of the list
function displayComment(username, body) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment-item";

    const heading = document.createElement("h3");
    heading.textContent = username;

    const commentText = document.createElement("p");
    commentText.textContent = body;

    commentDiv.appendChild(heading);
    commentDiv.appendChild(commentText);

    commentList.prepend(commentDiv);
}

// Show the starting comments (oldest first, so the newest ends up on top)
comments.slice().reverse().forEach(c => displayComment(c.username, c.body));

// Post a new comment
commentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const body = document.getElementById("comment").value.trim();

    if (!username || !body) {
        message.textContent = "Enter a username and a comment.";
        return;
    }

    comments.push({ username, body });
    displayComment(username, body);

    message.textContent = "Comment posted.";
    commentForm.reset();
});


// ---------- Weather (Open-Meteo public API, no API key needed) ----------

const WEATHER_URL =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=14.43&longitude=120.94" +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&timezone=Asia%2FManila";

// Open-Meteo weather codes (WMO) -> readable text
const WEATHER_CODES = {
    0: "Clear sky",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    80: "Light rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail"
};

async function loadWeather() {
    const status = document.getElementById("weatherStatus");
    const info = document.getElementById("weatherInfo");

    try {
        const response = await fetch(WEATHER_URL);

        if (!response.ok) {
            throw new Error("Weather request failed.");
        }

        const data = await response.json();
        const now = data.current;
        const units = data.current_units;

        document.getElementById("weatherTemp").textContent =
            `${Math.round(now.temperature_2m)}${units.temperature_2m}`;
        document.getElementById("weatherDesc").textContent =
            WEATHER_CODES[now.weather_code] || "Weather unavailable";
        document.getElementById("weatherFeels").textContent =
            `${Math.round(now.apparent_temperature)}${units.apparent_temperature}`;
        document.getElementById("weatherHumidity").textContent =
            `${now.relative_humidity_2m}${units.relative_humidity_2m}`;
        document.getElementById("weatherWind").textContent =
            `${Math.round(now.wind_speed_10m)} ${units.wind_speed_10m}`;

        status.hidden = true;
        info.hidden = false;

    } catch (error) {
        status.textContent = "Unable to load the weather right now.";
        console.error(error);
    }
}

loadWeather();
