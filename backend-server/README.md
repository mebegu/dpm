# Audio Processing Server

## Introduction

This project implements a REST API for handling audio files, including uploading, processing, and retrieving the status of audio files. The API supports recording audio, sending it for processing, and retrieving the processed results.

## Features

- **Upload Audio File:** Receives an audio file along with the user’s email address.
- **Process Audio File:** Queues the audio file for asynchronous processing.
- **Check Processing Status:** Retrieves the status of audio processing jobs.
- **[Not Implemented] Download Processed Audio:** Allows users to download the processed audio file.

## Assumptions

- Each audio file is processed asynchronously, and the final result can be retrieved once processing is complete.
- The system uses S3 (mocked) for storing audio files and uses an in-memory SQLite database for tracking processing statuses.

## Technologies

- **Language:** [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Runtime Env:** [Node.js](https://nodejs.org/en)
- **Web Framework:** [Express](https://www.npmjs.com/package/express)
- **Database:** [Sequelize](https://sequelize.org/) with SQLite (in-memory for tests)
- **Queue Service:** [AWS SQS](https://aws.amazon.com/sqs/) (mocked)
- **File Storage:** [AWS S3](https://aws.amazon.com/s3/) (mocked)
- **Logging:** [Winston](https://www.npmjs.com/package/winston), [Morgan](https://www.npmjs.com/package/morgan)
- **Documentation and API:** [JSdoc](https://jsdoc.app/), [Swagger](https://swagger.io/)

## Installation and Usage

1. Clone the repository from GitHub:

```bash
git clone git@github.com:mebegu/audio-processing-server.git
```

2. Install dependencies:

```bash
cd audio-processing-server
npm install
```

3. Start the backend server:

```bash
npm start
```

Contact
For any inquiries or feedback, please contact mbgurcay@gmail.com.