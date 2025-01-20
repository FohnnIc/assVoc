import axios from "axios";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "weatherapi_key";
const BASE_URL = "http://api.weatherapi.com/v1/current.json";

export const getWeather = async (city: string) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                key: WEATHER_API_KEY,
                q: city,
                lang: "fr",
            },
        });

        const weather = response.data;
        return `La température actuelle à ${city} est de ${weather.current.temp_c}°C avec ${weather.current.condition.text}.`;
    } catch (error) {
        console.error("Erreur lors de la récupération des données météo:", error);
        throw new Error("Impossible de récupérer les données météo.");
    }
};
