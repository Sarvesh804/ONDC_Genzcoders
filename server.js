const express = require('express');
const app = express();
const { spawn } = require('child_process');
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.post('/check-serviceability', (req, res) => {
    const pincode = req.body.pincode;

    // Spawn the C++ program as a child process
    const process = spawn('code5.exe', [pincode]);

    let result = '';

    // Handle process events
    process.stdout.on('data', (data) => {
        result += data.toString();
        console.log("Received data from C++ process:", data.toString());
    });

    process.stderr.on('data', (data) => {
        // Handle errors from the C++ program
        console.error(`Error: ${data}`);
    });

    process.on('close', (code) => {
        if (result === '') {
            console.log("No data received from C++ process.");
            res.status(500).json({ error: "No data received from C++ process." });
        } else {
            // Log the response before sending it back to the client
            // console.log("Response:", result);
            // Send the result back to the client as JSON
            res.json({ results: result });
        }
    });

    process.on('error', (err) => {
        // Log any errors that occur during process spawn
        console.error("Process error:", err);
        res.status(500).json({ error: "Internal server error" });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
