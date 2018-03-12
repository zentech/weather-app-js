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
	var month = currentDate.getMonth()+1;
	var day = currentDate.getDate();
	var year = currentDate.getFullYear();
	var hour = currentDate.getHours();
	var minute = currentDate.getMinutes();

	//setting the date
	console.log(hour+" "+minute+" = "+month+"/"+day+"/"+year)
	var dateElem = document.getElementById("date");
	dateElem.innerHTML = `${hour}:${minute} | ${month}/${day}/${year}`;

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
				console.log(tempFaren)
				var humidity = jsonWeather.main.humidity;
				var windSpeed = jsonWeather.wind.speed; 
				var windDegree = jsonWeather.wind.deg;

				//insert into html page
				var description = document.getElementById("description");
				description.innerHTML = `<i id="icon-desc" class="wi wi-owm-${id}"></i><p>${weatherDesc}</p>`;
				var tempElement = document.getElementById("temperature");
				tempElement.innerHTML = `${tempFaren}<i id="icon-thermometer" class="wi wi-thermometer"></i>`	;
				var humidityElem = document.getElementById("humidity");
				humidityElem.innerHTML = `${humidity}%`;
				var windElem = document.getElementById("wind");
				windElem.innerHTML = `${windSpeed}m/h`;
				var degreeElem = document.getElementById("degree");
				degreeElem.innerHTML = `${windDegree}&#176;`;
			}
		}
		httpReqWeather.send();
	}							
}