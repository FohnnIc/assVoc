import {Request, Response} from 'express';
import {sendMessageToMistral} from '../services/mistral.service';

export const handleMessage = async (req: Request, res: Response): Promise<void> => {
    const {message} = req.body;

    if (!message) {
        res.status(400).json({error: 'Message is required'});
        return;
    }

    try {
        const mistralResponse = await sendMessageToMistral(message);
        res.json(mistralResponse);
    } catch (error: any) {
        res.status(500).json({
            error: error.message || 'An unexpected error occurred',
        });
    }
};