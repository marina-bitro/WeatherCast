// Library
import express from "express"
import axios from "axios" //for fetching and retrieving data 
import cors from "cors" // allows communication between different ports

//Server
const app = express()

//
app.use(cors())

//GET request for the weather 
app.get("/weather", async (req, res) => {

    const { lat, lon } = req.query

    // error if one of the two has not correct value
    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing coordinates" })
    }

    //gets the data or catches the error 
    try {
        const response = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true,
                    hourly: "temperature_2m,weathercode,windspeed_10m",
                    daily: "temperature_2m_max,temperature_2m_min,weathercode",
                    timezone: "Europe/Athens",
                    forecast_days: 10
                }
            }
        )

        res.json(response.data)

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data." })
    }
})

//Server running
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000")
})