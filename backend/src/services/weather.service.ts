import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "weatherapi_key";
const BASE_URL = "http://api.weatherapi.com/v1/current.json";

export const getWeather = async (city: string): Promise<string> => {
    try {
        console.log("Appel à l'API météo pour la ville :", city);

        const response = await axios.get(BASE_URL, {
            params: {
                key: WEATHER_API_KEY,
                q: city,
                lang: "fr",
            },
        });

        console.log("Réponse API Météo reçue :", response.data);

        const weather = response.data;
        return `La température actuelle à ${city} est de ${weather.current.temp_c}°C avec ${weather.current.condition.text}.`;
    } catch (error) {
        // @ts-ignore
        console.error("Erreur API Weather :", error.response?.data || error.message);

        // Lever une erreur utilisateur-friendly
        throw new Error("Impossible de récupérer les données météo.");
    }
};
