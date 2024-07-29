import React from 'react';
import AudioRecorder from './components/AudioRecorder';
import TaskList from './components/TaskList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <TaskList />
    </div>
  );
}

export default App;
