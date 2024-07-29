const AWS = require('aws-sdk');
const fs = require('fs');
const { logger } = require("./logger");
const { s3: s3Config } = require('./config');

// Configure AWS SDK
/*
const s3 = new AWS.S3({
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
    endpoint: s3Config.endpoint,
    s3ForcePathStyle: s3Config.s3ForcePathStyle,
});
*/

/**
 * Uploads a file to an S3 bucket.
 * @function uploadToS3
 * @param {string} filePath - The local path to the file to be uploaded.
 * @param {string} fileName - The name to be used for the file in S3.
 * @returns {Promise<string>} - The URL of the uploaded file in S3.
 * @throws {Error} - If there is an issue with uploading the file.
 * @example
 * // Upload a file and get the URL
 * const url = await uploadToS3('/path/to/file.wav', 'audio-file.wav');
 */
const uploadToS3 = async (filePath, fileName) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: s3Config.bucketName,
        Key: fileName,
        Body: fileContent,
    };

    try {
        logger.info(`Mock S3: uploading file ${params.Bucket}/${params.Key}`);
        return `https://${s3Config.bucketName}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

/**
 * Downloads a file from an S3 bucket.
 * @function downloadFromS3
 * @param {string} fileName - The name of the file to be downloaded from S3.
 * @returns {Promise<ReadStream>} - A readable stream of the file content.
 * @throws {Error} - If there is an issue with downloading the file.
 * @example
 * // Download a file and get the file stream
 * const fileStream = await downloadFromS3('corrected-file.wav');
 */
const downloadFromS3 = async (fileName) => {
    const params = {
        Bucket: s3Config.bucketName,
        Key: fileName,
    };

    try {
        logger.info('Mock S3: downloading file', params);
        return "file.wav";
    } catch (error) {
        console.error('Error downloading from S3:', error);
        throw new Error('Failed to download file from S3');
    }
};

module.exports = { uploadToS3, downloadFromS3 };
