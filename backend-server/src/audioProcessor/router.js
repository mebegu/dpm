const express = require("express");
const { receiveAudioFile, getProcessStatus, listProcesses, downloadResult } = require("./controller");
const { upload } = require('../multerConfig');

const AudioProcessorRouter = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an audio file for processing.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response with the job ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       400:
 *         description: Invalid request or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
AudioProcessorRouter.post("/upload", upload.single('file'), receiveAudioFile);

/**
 * @swagger
 * /status/{id}:
 *   get:
 *     summary: Get the processing status of an audio file.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The job ID
 *     responses:
 *       200:
 *         description: Successful response with the status of the job.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 correctedAudio:
 *                   type: string
 *       404:
 *         description: Job ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
AudioProcessorRouter.get("/status/:id", getProcessStatus);

/**
 * @swagger
 * /status:
 *   get:
 *     summary: List all audio processing jobs.
 *     responses:
 *       200:
 *         description: Successful response with a list of all jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   status:
 *                     type: string
 *                   correctedFilePath:
 *                     type: string
 */
AudioProcessorRouter.get("/status", listProcesses);

/**
 * @swagger
 * /download/{id}:
 *   get:
 *     summary: Download the processed audio file if available.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The job ID
 *     responses:
 *       200:
 *         description: Successful response with the audio file.
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Audio processing is not yet completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Job ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
AudioProcessorRouter.get("/download/:id", downloadResult);

module.exports = { AudioProcessorRouter };
