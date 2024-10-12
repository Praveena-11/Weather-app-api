import { useEffect, useState } from 'react'
import './App.css'
import searchIcon from "./assets/search.png"
import sunIcon from "./assets/sun.png"
import cloudIcon from "./assets/cloudy.png"
import humidityIcon from "./assets/humidity.png"
import snowIcon from "./assets/snow.png"
import rainIcon from "./assets/rain.png"
import thunderIcon from "./assets/thunder.png"
import windIcon from "./assets/wind.png"

const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind}) =>{
 return(
  <>
  <div className='image'> 
  <img src={icon} alt='Image'></img>
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className='lat'>latitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className='log'>longitude</span>
      <span>{log}</span>
    </div>
  </div>
  <div className="data-container">
    <div className='element'>
      <img src={humidityIcon} alt='humidity' className='icon'></img>
      <div className="data">
        <div className="humidity-percent">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
    </div>
    <div className='element'>
      <img src={windIcon} alt='wind' className='icon'></img>
      <div className="data">
        <div className="wind-percent">{wind}km/h</div>
        <div className="text">Wind Speed</div>
      </div>
    </div>
  </div>
  </>)
}
// WeatherDetails.propTypes ={
//   icon:PropTypes.string.isRequired,
//   temp:PropTypes.number.isRequired,
//   city:PropTypes.string.isRequired,
//   country:PropTypes.string.isRequired,
//   humidity:PropTypes.number.isRequired,
//   wind:PropTypes.number.isRequired,
//   lat:PropTypes.number.isRequired,
//   log:PropTypes.number.isRequired,
// }


function App() {
  const[icon,setIcon]=useState(snowIcon)
  const[temp,setTemp]= useState(0)
  const[city,setCity]=useState("Chennai")
  const[country,setCountry]=useState("IN")
  const[lat,setLat]=useState(0)
  const[log,setLog]=useState(0)
  const[humidity,setHumidity]=useState(0)
  const[wind,setWind]=useState(0)
  const[text,setText]=useState("Chennai")

  const [cityNotFound,setCityNotFound] = useState
  (false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const weatherIconmap = {
    "01d":sunIcon,
    "01n":sunIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":thunderIcon,
    "03n":thunderIcon,
    "04d":thunderIcon,
    "04n":thunderIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };

  const search = async () => {
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=0d5779d915f5aafab800dc3db1d8fe08&units=Metric`;

    try{
      setLoading(true);
      let res= await fetch (url);
      let data = await res.json();
      if (data.cod === "404"){
        console.error("city Not Found")
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed); 
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconmap [weatherIconCode]|| snowIcon);
      setCityNotFound(false);


    }catch(error){
      console.error("An error occured:",error.message);
      setError("An error occured while fetching weather data.")
    }finally{
      setLoading(false);
    }
  }
  const handlecity = (e) =>{
    setText(e.target.value);
  }
  const handlekeyDown=(e) =>{
    if (e.key === "Enter"){
      search();
    }
  }
  useEffect(function (){
    search();
  },[])
  

  return (
    <>
    <div className='container'>
      <div className='input-container'>
        <input type='text' className='cityInput' placeholder='Search City' onChange={handlecity} value={text} onKeyDown={handlekeyDown}></input>
        <div className='search-icon' onClick={() =>search()}>
          <img src={searchIcon} alt='Search'></img>
        </div>
      </div>
      
    {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City not found</div>}
      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}
      <p className='copyright'>
      Designed by <span>Praveena</span>
      </p>
    </div>
    </>
  )
}

export default App