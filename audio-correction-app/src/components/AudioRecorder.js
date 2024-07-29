import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button, Typography, Paper, Container, Grid, CircularProgress, TextField } from '@mui/material';
import { uploadAudio } from '../services/api';

const AudioRecorder = ({ onUploadSuccess }) => {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [email, setEmail] = useState('test@example.com'); // Set default email here
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null); // Ref to store the media stream

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream; // Save the stream to the ref
                const mediaRecorder = new MediaRecorder(stream);

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();

                const chunks = [];
                mediaRecorder.ondataavailable = (event) => {
                    chunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    setAudioBlob(blob);
                };

                setRecording(true);
                toast.info('Recording started...');
            } catch (error) {
                console.error('Error accessing audio device.', error);
                toast.error('Error accessing audio device.');
            }
        } else {
            toast.error('Your browser does not support audio recording.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            toast.info('Recording stopped.');

            // Stop the media stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null; // Clear the stream reference
            }
        }
    };

    const handleUpload = async () => {
        if (!audioBlob) {
            toast.error('No audio to upload.');
            return;
        }

        if (!email) {
            toast.error('Please provide your email.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', audioBlob, 'recorded-audio.wav');
        formData.append('email', email); // Add email to form data

        try {
            await uploadAudio(formData);
            toast.success('Upload successful');
            if (onUploadSuccess) onUploadSuccess(); // Call the callback function
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Audio Recorder
                </Typography>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={recording}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={startRecording}
                            disabled={recording}
                            sx={{ width: '100%' }}
                        >
                            {recording ? <CircularProgress size={24} /> : 'Start Recording'}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={stopRecording}
                            disabled={!recording}
                            sx={{ width: '100%' }}
                        >
                            Stop Recording
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleUpload}
                            disabled={!audioBlob || uploading}
                            sx={{ width: '100%' }}
                        >
                            {uploading ? <CircularProgress size={24} /> : 'Upload'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AudioRecorder;
