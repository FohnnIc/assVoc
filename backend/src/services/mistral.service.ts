import {Mistral} from "@mistralai/mistralai";
import {getWeather} from "./weather.service";
import dotenv from "dotenv";

dotenv.config();

const mistral = new Mistral({
    server: "eu",
    apiKey: process.env.MISTRAL_API_KEY ?? "",
});

interface MistralAction {
    action: string;
    parameters: {
        location?: string;
    };
}

export const sendMessageToMistral = async (message: string): Promise<any> => {
    try {
        console.log("Envoi du message à Mistral :", message);

        const mistralResponse = await mistral.agents.complete({
            messages: [
                {
                    content: message,
                    role: "user",
                },
            ],
            agentId: process.env.MISTRAL_AGENT_ID || "",
        });

        console.log("Réponse reçue de Mistral :", mistralResponse);

        // @ts-ignore
        const data = mistralResponse.choices[0]?.message?.content;

        if (data) {
            try {
                // @ts-ignore
                const parsedData: MistralAction = JSON.parse(data);

                if (parsedData.action === "get_weather" && parsedData.parameters?.location) {
                    console.log("Action détectée : get_weather pour le lieu", parsedData.parameters.location);

                    const weatherInfo = await getWeather(parsedData.parameters.location);

                    console.log("Données météo récupérées :", weatherInfo);

                    return {
                        message: weatherInfo,
                    };
                }
            } catch (error) {
                console.info("Aucune action spécifique détectée. Renvoi de la réponse brute.");
            }
        }

        console.log("Aucune action spécifique trouvée. Renvoi de la réponse brute.");
        return {message: data || "Aucune réponse exploitable reçue de Mistral."};
    } catch (error: any) {
        console.error("Erreur API Mistral : ", error);

        throw new Error(
            `API error occurred: Status ${error.response?.status || 'Unknown'} Content-Type ${error.response?.headers["content-type"] || 'Unknown'} Body ${error.response?.data || error.message}`
        );
    }
};