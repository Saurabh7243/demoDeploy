// src/server.js
const express = require('express');
const app = express();
const { spawn } = require('child_process');
const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(express.json());
app.use(express.static('public')); // Serving static files

// Function to run the Python script and return the result
function runPythonScript() {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, 'script.py');
    const pythonProcess = spawn('python', [pythonScriptPath, 'Saurabh']);

    let result = '';

    // Capture the standard output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString(); // Accumulate data
    });

    // Capture any errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      reject(`Error from Python: ${data.toString()}`); // Reject promise on error
    });

    // Resolve promise when the script completes
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result); // Successfully resolve with the result
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
}

// Routes
app.get('/', async (req, res) => {
  try {
    const pythonResult = await runPythonScript();
    res.send(`: ${pythonResult}`);
  } catch (error) {
    res.status(500).send(`Failed to run Python script: ${error}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
