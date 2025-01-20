import {Request, Response} from 'express';
import {sendMessageToMistral} from '../services/mistral.service';

export const handleMessage = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;

    if (!message) {
        res.status(400).json({ error: "Le message est requis" });
        return;
    }

    try {
        const response = await sendMessageToMistral(message);
        res.json(response);
    } catch (error: any) {
        console.error("Erreur dans handleMessage:", error.message);
        res.status(500).json({
            error: error.message || "Une erreur inattendue s'est produite",
        });
    }
};