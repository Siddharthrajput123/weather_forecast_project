
//this will select HTML elements with the following class names.
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentweatherdiv = document.querySelector(".current-weather");
const weatherCardsdiv = document.querySelector(".weather-cards");
const RecentlySearched =document.querySelector(".city-input");

//this is a OpenWeatherMap API key 
const API_KEY = "4fb79e09e3852447e9b1a328dc67d652";

// this function takes 3 arguments
const createWeatherCard = (cityName, weatherItem, index) => {
    const date = weatherItem.dt_txt.split(" ")[0];  //take date from weatherItem.dt_txt
    const temp = (weatherItem.main.temp - 273.15).toFixed(2);
    const wind = weatherItem.wind.speed;
    const humidity = weatherItem.main.humidity;
    const icon = weatherItem.weather[0].icon;
    const description = weatherItem.weather[0].description;

    let result;
if (index === 0) {   //if index is 0 it will create a current weather hand this if block will run
    result = `<div class="details">
                <h2>${cityName} (${date})</h2>
                <h4>Temperature: ${temp}°C</h4>
                <h4>Wind: ${wind} M/s</h4>
                <h4>Humidity: ${humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png"> 
                <h4>${description}</h4>
            </div>`;
            //if index is not 0 then cards block will run
} else {             
    result = `<li class="cards">
                <h3>(${date})</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png"> 
                <h4>Temp: ${temp}°C</h4>
                <h4>Wind: ${wind} M/s</h4>
                <h4>Humidity: ${humidity}%</h4>
            </li>`;
}
return result;

};

const getWeatherDetails = (cityName, lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;  //constructs a API URLfor weather forcaste
    fetch(url)
        .then(res => res.json())    //fetched data is now converted to JSON 
        .then(data => {
            const uniqueDays = new Set();   //set is used to get unique dates as set() doesn't contaian same or repeadted items
            const fivedaysForecast = data.list.filter(forecast => {
                const date = new Date(forecast.dt_txt).getDate();
                if (!uniqueDays.has(date)) {     // "has" method returns true if the specified value contains in the set
                    uniqueDays.add(date);   // add() methods Adds the unique date to the set
                    return true;
                }
            });

            //clears the input field and weather deatils
            cityInput.value = "";
            currentweatherdiv.innerHTML = "";
            weatherCardsdiv.innerHTML = "";
            
            //creates weather cards and insert them into correct place using insertAdjacentHTML()
            fivedaysForecast.forEach((item, index) => {
                const card = createWeatherCard(cityName, item, index);
                if (index === 0) {
                    currentweatherdiv.insertAdjacentHTML("beforeend", card);
                } else {
                    weatherCardsdiv.insertAdjacentHTML("beforeend", card);
                }
            });
        })
        .catch(() => alert("An error occurred while fetching the weather forecast.")); //handels error in weather forcaste by alert box
};


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //get cityname from input field and trim any whitespaces
    if (!cityName) return;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;//Constructs the API URL to get city coordinates 
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert("No coordinates found!"); //if data is not returned alert is printed
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);  //or we get the cordinates name,latitude,longitude.
        })
        .catch(() => alert("An error occurred while fetching city coordinates."));
};

// this function is used to get user coordinates to get current location

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
            const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => alert("An error occurred while fetching the city!"));
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied");
            }
        }
    );
};

//adds a eventlistener to add input city names into session storage
console.log(RecentlySearched.value);

RecentlySearched.addEventListener("change",function(){
    sessionStorage.setItem("RecentlySearched" ,RecentlySearched.value);
})


//Adds an click event listeners to the locationButton and searchButton to call getUserCoordinates and getCityCoordinates functions .
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);

