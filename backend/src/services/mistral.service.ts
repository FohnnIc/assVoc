import {Mistral} from "@mistralai/mistralai";

const mistral = new Mistral({
    server: "eu",
    apiKey: process.env["MISTRAL_API_KEY"] ?? "",
});

interface MistralResponse {
    data: any;
}

export const sendMessageToMistral = async (message: string): Promise<MistralResponse> => {
    try {
        return await mistral.agents.complete({
            messages: [
                {
                    content: message,
                    role: "user",
                },
            ],
            agentId: "ag:d7b686b9:20250120:untitled-agent:1fa225f7",
        }).then((response) => {
            return {data: response};
        });
    } catch (error: any) {
        console.error('Error communicating with Mistral API:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to communicate with Mistral API');
    }
};