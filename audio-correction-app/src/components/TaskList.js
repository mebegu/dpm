import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast function
import { listProcesses, downloadProcessedAudio } from '../services/api';
import { Container, Paper, Typography, List, ListItem, ListItemText, Button, Grid, CircularProgress } from '@mui/material';
import AudioRecorder from './AudioRecorder'; // Import the AudioRecorder component

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true); // Start loading indicator
        try {
            const response = await listProcesses();
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false); // End loading indicator
        }
    };

    useEffect(() => {
        fetchTasks(); // Fetch tasks on initial load
    }, []);

    const handleDownload = async (id) => {
        try {
            const response = await downloadProcessedAudio(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `processed-${id}.wav`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Download successful');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Download failed');
        }
    };

    // Callback to refresh the task list after upload
    const handleUploadSuccess = () => {
        fetchTasks(); // Refresh task list
    };

    // Format the date timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Task List
                </Typography>
                <AudioRecorder onUploadSuccess={handleUploadSuccess} />
                <br />
                <br />
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={fetchTasks}
                            sx={{ mb: 2 }}
                        >
                            Refresh List
                        </Button>
                    </Grid>
                    {loading ? (
                        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}>
                            <CircularProgress />
                        </Grid>
                    ) : (
                        <List>
                            {tasks.map(task => (
                                <ListItem key={task.id} divider>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" gutterBottom>
                                                <strong>ID:</strong> {task.id}
                                                <br />
                                                <strong>Email:</strong> {task.email}
                                                <br />
                                                <strong>Date:</strong> {formatDate(task.createdAt)}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Status:</strong> {task.status}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleDownload(task.id)}
                                                    disabled={task.status !== 'done'}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Download Processed Audio
                                                </Button>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default TaskList;
