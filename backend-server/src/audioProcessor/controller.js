const { logger } = require("../logger");
const {
  receiveAudioFileService,
  getProcessStatusService,
  listProcessesService,
  downloadResultService
} = require('./service');

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an audio file for processing
 *     description: Handles the request to upload an audio file for processing and returns an ID for tracking.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The audio file to upload.
 *     responses:
 *       200:
 *         description: Successfully uploaded the audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the uploaded audio file.
 *                   example: uuid4
 *       500:
 *         description: Error uploading the audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error uploading audio
 */
const receiveAudioFile = async (req, res) => {
  const { email } = req.body;
  const audioPath = req.file.path;

  try {
    const id = await receiveAudioFileService(email, audioPath);
    logger.info(id);
    res.status(200).json({ id });
  } catch (error) {
    logger.error('Error uploading to S3', error);
    res.status(500).json({ error: 'Error uploading audio' });
  }
};

/**
 * @swagger
 * /status/{id}:
 *   get:
 *     summary: Get the processing status of an audio file
 *     description: Retrieves the status of the audio processing job and the URL for the processed audio file if available.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the audio processing job.
 *         schema:
 *           type: string
 *           example: uuid4
 *     responses:
 *       200:
 *         description: Successfully retrieved the processing status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The current status of the audio processing job.
 *                   example: processed
 *                 correctedAudio:
 *                   type: string
 *                   description: URL to the corrected audio file if processing is complete.
 *                   example: https://s3.example.com/audio-uuid4.wav
 *       500:
 *         description: Error retrieving the processing status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error retrieving status
 */
const getProcessStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const audioRecord = await getProcessStatusService(id);

    const response = {
      status: audioRecord.status,
      correctedAudio: audioRecord.correctedFilePath ? audioRecord.correctedFilePath : null,
    };
    logger.info(response);
    res.json(response);
  } catch (error) {
    logger.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /list:
 *   get:
 *     summary: List all audio processing jobs
 *     description: Retrieves a list of all audio processing jobs with their status and details.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of audio processing jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the audio processing job.
 *                     example: uuid4
 *                   email:
 *                     type: string
 *                     description: The email address of the user who uploaded the audio.
 *                     example: user@example.com
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the audio was created.
 *                     example: 2024-07-29T14:57:59.711Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the audio record was last updated.
 *                     example: 2024-07-29T15:01:59.711Z
 *                   filePath:
 *                     type: string
 *                     description: The path to the original audio file.
 *                     example: /path/to/audio-file.wav
 *                   correctedFilePath:
 *                     type: string
 *                     description: The path to the corrected audio file if processing is complete.
 *                     example: /path/to/corrected-audio-file.wav
 *                   status:
 *                     type: string
 *                     description: The status of the audio processing job.
 *                     example: queued
 *       500:
 *         description: Error retrieving the list of audio processing jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error retrieving the list
 */
const listProcesses = async (req, res) => {
  try {
    const processes = await listProcessesService();

    const response = processes.map(p => ({
      id: p.id,
      email: p.email,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      filePath: p.filePath,
      correctedFilePath: p.correctedFilePath,
      status: p.status,
    }));

    logger.info('Processes:', JSON.stringify(response, null, 2)); // Pretty print the logs
    res.json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /download/{id}:
 *   get:
 *     summary: Download the processed audio file
 *     description: Allows the user to download the processed audio file if available.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the audio processing job.
 *         schema:
 *           type: string
 *           example: uuid4
 *     responses:
 *       200:
 *         description: Successfully downloaded the processed audio file.
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: The audio file was not found or is not yet processed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Audio file not found or not processed
 *       500:
 *         description: Error downloading the audio file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error downloading audio
 */
const downloadResult = async (req, res) => {
  const { id } = req.params;

  try {
    const fileStream = await downloadResultService(id);
    res.attachment(`corrected-${id}.wav`);
    fileStream.pipe(res);
  } catch (error) {
    logger.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { receiveAudioFile, getProcessStatus, listProcesses, downloadResult };
