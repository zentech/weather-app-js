/* 
 Weather App Javascript code
 author: George Louis
 date:   3/11/2018
 purpose: get local weather
*/
window.onload = function() {
	//variables
	var ipUrl = "https://ipinfo.io/json";				
	var appid = "appid=8e1880f460a20463565be25bc573bdc6";
	var location = document.getElementById("location");	
	var currentDate = new Date();
	var dayNight = "day";	

	//setting the date
	var dateElem = document.getElementById("date");
	dateElem.innerHTML = currentDate.toDateString();

	//calling ipinfo.io/json function
	httpReqIpAsync(ipUrl);							

	//request to ipinfo.io/json
	function httpReqIpAsync(url, callback) {
		var httpReqIp = new XMLHttpRequest();
		httpReqIp.open("GET", url, true)
		httpReqIp.onreadystatechange = function() {
			if(httpReqIp.readyState == 4 && httpReqIp.status == 200) {
				var jsonIp = JSON.parse(httpReqIp.responseText)
				var ip = jsonIp.ip;
				var city = jsonIp.city;
				var country = jsonIp.country;
				location.innerHTML = `${city}, ${country}`;
				var lat = jsonIp.loc.split(",")[0];
				var lon = jsonIp.loc.split(",")[1];
				console.log(lat+" "+lon)
				var weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${appid}`;
				//calling openweathermap api function
				httpReqWeatherAsync(weatherApi);
			}
		}
		httpReqIp.send();				
	}
	
	//request to openweathermap.com json
	function httpReqWeatherAsync(url, callback) {
		var httpReqWeather = new XMLHttpRequest();
		httpReqWeather.open("GET", url, true);
		httpReqWeather.onreadystatechange = function() {
			if(httpReqWeather.readyState == 4 && httpReqWeather.status == 200) {
				var jsonWeather = JSON.parse(httpReqWeather.responseText);
				console.log(jsonWeather)
				var weatherDesc = jsonWeather.weather[0].description;
				var id = jsonWeather.weather[0].id;
				var icon = `<i class="wi wi-owm-${id}"></i>`
				var temperature = jsonWeather.main.temp;
				var tempFaren = Math.round(1.8 * (temperature - 273) + 32)
				// console.log(tempFaren)
				var humidity = jsonWeather.main.humidity;
				var windSpeed = jsonWeather.wind.speed; 
				//converting visibility to miles 
				var visibility = Math.round(jsonWeather.visibility / 1000);
				// console.log(visibility)

				//find whether is day or night
				var sunSet = jsonWeather.sys.sunset;
				//sunset is 10 digits and currentDate 13 so div by 1000
				var timeNow = Math.round(currentDate / 1000);
				console.log(timeNow + "<" + sunSet +" = "+(timeNow < sunSet))
				dayNight = (timeNow < sunSet) ? "day" : "night";
				//insert into html page
				var description = document.getElementById("description");
				description.innerHTML = `<i id="icon-desc" class="wi wi-owm-${dayNight}-${id}"></i><p>${weatherDesc}</p>`;
				var tempElement = document.getElementById("temperature");
				tempElement.innerHTML = `${tempFaren}<i id="icon-thermometer" class="wi wi-thermometer"></i>`	;
				var humidityElem = document.getElementById("humidity");
				humidityElem.innerHTML = `${humidity}%`;
				var windElem = document.getElementById("wind");
				windElem.innerHTML = `${windSpeed}m/h`;
				var visibilityElem = document.getElementById("visibility");
				visibilityElem.innerHTML = `${visibility} miles`;
			}
		}
		httpReqWeather.send();
	}							
}