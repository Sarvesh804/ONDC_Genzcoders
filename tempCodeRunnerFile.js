const express = require('express');
const app = express();
const { spawn } = require('child_process');
const cors = require('cors'); // Import the CORS middleware

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.post('/check-serviceability', (req, res) => {
    const pincode = req.body.pincode; // Assuming pincode is sent in the request body
    console.log(pincode);
    // Corrected path with escaped backslashes
    const process = spawn('g++', ['C:\\Users\\sarve\\OneDrive\\Desktop\\ondc frontend\\server\\code5.cpp', '-o', 'code5.exe']);
    spawn('code5.exe', [pincode]);


    let result = '';

    process.stdout.on('data', (data) => {
        result += data.toString();
    });

    process.on('close', () => {
        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
