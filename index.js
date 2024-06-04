// Import module Express
const express = require('express');
const cors = require('cors');

// Initializa app Express
const app = express();

// Define the port on which the server will listen
const port = 3000;

// Configure CORS to allow requests from any origin with credentials
app.use(cors({
    origin: true,
    credentials: true
}));

// Handle POST requests to '/getAdvertisexBid' endpoint
app.post('/getAdvertisexBid', (req, res) => {
    // Respond with a JSON object representing a bid
    res.json({
        bidId: "1",
        cpm: 3.5764,
        width: 300,
        height: 250,
        creativeId: "advertisex-1",
        ad: `
            <div class="w-80 h-64 ml-auto mr-auto p-4 bg-white border border-black rounded-md">
                <h4 class="text-center">AdvertiseX</h4>
                <p class="text-center">AdvertiseX content description</p>
            </div>
        `
    });
});


// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Mock server listening on http://localhost:${port}`);
});