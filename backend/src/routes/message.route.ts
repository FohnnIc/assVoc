import { Router } from 'express';
import { handleMessage } from '../controllers/message.controller';

const router = Router();

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Envoyer un message à Mistral
 *     tags: [Mistral]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Bonjour, comment vas-tu ?"
 *     responses:
 *       200:
 *         description: Réponse réussie contenant la réponse de Mistral
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Réponse générée par Mistral
 *       400:
 *         description: Requête invalide si le message est manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message is required"
 *       500:
 *         description: Erreur lors de la communication avec l'API Mistral
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to communicate with Mistral API"
 */
router.post('/', handleMessage);

export default router;