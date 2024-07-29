const { logger } = require("../logger");
const { v4: uuidv4 } = require('uuid');
const { Audio } = require('./model');
const { uploadToS3, downloadFromS3 } = require('../s3');

/**
 * Handles the process of receiving an audio file, uploading it to S3, and queuing the job.
 * @function receiveAudioFileService
 * @param {string} email - The email address of the user uploading the audio file.
 * @param {string} audioPath - The local path to the uploaded audio file.
 * @returns {Promise<string>} - The ID of the audio processing job.
 * @throws {Error} - If there is an issue with uploading to S3 or saving to the database.
 */
const receiveAudioFileService = async (email, audioPath) => {
  const id = uuidv4();
  const s3FileName = `audio-${id}.wav`;

  const s3Url = await uploadToS3(audioPath, s3FileName);
  const audioRecord = await Audio.create({ id, email, filePath: s3Url, status: 'queued' });

  // Mock sending message to SQS queue
  logger.info('Mock SQS: Sending message', { id: audioRecord.id });

  return audioRecord.id;
};

/**
 * Retrieves the status of a specific audio processing job.
 * @function getProcessStatusService
 * @param {string} id - The ID of the audio processing job.
 * @returns {Promise<Object>} - The status of the job and URL of the corrected audio if available.
 * @throws {Error} - If the audio record is not found or there is a database issue.
 */
const getProcessStatusService = async (id) => {
  const audioRecord = await Audio.findByPk(id);
  if (!audioRecord) {
    throw { status: 404, message: 'Record not found' };
  }
  return audioRecord;
};

/**
 * Lists all audio processing jobs.
 * @function listProcessesService
 * @returns {Promise<Array>} - An array of all audio processing jobs.
 * @throws {Error} - If there is a database issue.
 */
const listProcessesService = async () => {
  return await Audio.findAll({
    order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
  });
};

/**
 * Downloads the processed audio file from S3 if processing is complete.
 * @function downloadResultService
 * @param {string} id - The ID of the audio processing job.
 * @returns {Promise<ReadStream>} - A readable stream of the corrected audio file.
 * @throws {Error} - If the audio record is not found, processing is not complete, or there is an issue downloading from S3.
 */
const downloadResultService = async (id) => {
  const audioRecord = await Audio.findByPk(id);
  if (!audioRecord) {
    throw { status: 404, message: 'Record not found' };
  }
  if (audioRecord.status !== 'processed') {
    throw { status: 400, message: 'Audio processing is not yet completed' };
  }

  const fileKey = audioRecord.correctedFilePath.split('/').pop();
  return downloadFromS3(fileKey);
};

module.exports = { receiveAudioFileService, getProcessStatusService, listProcessesService, downloadResultService };
