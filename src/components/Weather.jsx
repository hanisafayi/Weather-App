import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {

    //Reference for the input field
    const inputRef = useRef()
    //State to store weather data
    const [weatherData, setWeatherData] = useState(false);

    //Mapping of weather condition codes to corresponding icons
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }

    // Function to fetch weather data from the API
    const search = async (city)=>{
        if(city === ""){
            alert("Enter City Name");
            return;
        }
        try {
            // API endpoint with the city name and API key
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if(!response.ok){
                alert(data.message); // Alert user if an error occurs
                return;
            }
            
            console.log(data); // Log data for debugging

            // Select the appropriate icon for the weather condition
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            
            // Update state with fetched weather data
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            })
        } catch (error) {
            setWeatherData(false);
            console.error("Error in fetaching weather data");
        }
    }

    // Fetch weather data for New York on initial render
    useEffect(()=>{
        search("New York");
    },[])

  return (
    <div className='weather'>
        {/* Search bar */}
        <div className='search-bar'>
            <input ref={inputRef} type="text" placeholder='Search'/>
            <motion.img
                src={search_icon} 
                alt="" 
                onClick={()=>search(inputRef.current.value)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            />
        </div>  

        {/* Display weather data if available */}
        {weatherData?<>  
        <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >  
        <img src={weatherData.icon} alt="" className='weather-icon'/>  
        <p className='temperature'>{weatherData.temperature}°C</p> 
        <p className='location'>{weatherData.location}</p>

        {/* Weather details section */} 
        <div className="weather-data">
            <motion.div className="col" animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <img src={humidity_icon} alt="" />
                <div>
                    <p>{weatherData.humidity}</p>
                    <span>Humidity</span>
                </div>
            </motion.div>
            <motion.div className="col" animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <img src={wind_icon} alt="" />
                <div>
                    <p>{weatherData.windSpeed} Km/h</p>
                    <span>Wind speed</span>
                </div>
            </motion.div>
        </div>  
        </motion.div>
        </>:<></>}     
    </div>
  )
}

export default Weather