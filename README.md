# Audio Correction App

This repository contains the implementation for an audio correction application, encompassing both frontend and backend components. Below is a brief overview of the directory structure and its contents.

## Directory Structure

### `audio-correction-app/`
This folder contains the frontend application for the audio correction system.

- **Purpose:** Provides the user interface to record, upload, and playback audio.
- **Technology:** Built using [Create React App](https://create-react-app.dev/), with AI assistance for UI components.

### `backend-server/`
This folder contains the backend server for handling audio processing.

- **Purpose:** Manages audio file uploads, processes the audio asynchronously, and serves the corrected audio files.
- **Technology:** Utilizes AWS services such as S3 for file storage, SQS for task queuing, and Lambda for processing.
  - **Node.js:** Runtime environment for executing JavaScript code server-side.
  - **Express:** Web framework for building the REST API.
  - **Sequelize:** ORM for interacting with the database.
  - **Multer:** Middleware for handling file uploads.

### `Audio Correction App System Design (Architecture).png`
- **Purpose:** Contains the architecture diagram of the audio correction application.
- **Description:** Provides a visual representation of the system design and components.

## Getting Started

1. **Frontend Application:**
   - Navigate to the `audio-correction-app` folder.
   - Install dependencies: `npm install`
   - Start the development server: `npm start`

2. **Backend Server:**
   - Navigate to the `backend-server` folder.
   - Install dependencies: `npm install`
   - Start the server: `npm start`

For more details on the implementation and how to set up the environment, please refer to the `README.md` file in each respective directory.
