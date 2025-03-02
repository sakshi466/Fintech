const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/fetch-mutual-funds", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default; // Dynamic import
        const response = await fetch("https://www.amfiindia.com/spages/NAVAll.txt");
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
