const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const dotenv = require('dotenv')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load environment variables
dotenv.config();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Express app
const app = express();
const PORT = 5000;

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the index.html file
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    } catch (error) {
        res.status(404).json({ error: 'Index file not found.' });
    }
});

// Serve static files from the assets/ directory
app.get('/assets/:filename', (req, res) => {
    const assetsFolder = path.join(__dirname, '../client/dist/assets');
    try {
        res.sendFile(path.join(assetsFolder, req.params.filename));
    } catch (error) {
        res.status(404).json({ error: `File ${req.params.filename} not found in assets folder.` });
    }
});

// API route to handle GET and POST requests to /api/questions
app.get('/api/questions', async (req, res) => {
    const questionsFilePath = path.join(__dirname, 'questions.json');
    
    try {
        const fileExists = await fs.access(questionsFilePath)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            return res.status(404).json({ error: 'Questions file not found.' });
        }

        const questionsData = await fs.readFile(questionsFilePath, 'utf-8');
        const parsedData = JSON.parse(questionsData);
        res.json(parsedData);
    } catch (error) {
        if (error instanceof SyntaxError) {
            res.status(500).json({ error: 'Error decoding the JSON file.' });
        } else {
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    }
});

// API route to handle file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    try {
        // Convert file buffer to base64
        const encodedFile = req.file.buffer.toString('base64');
        
        // Read the prompt file
        const promptFilePath = path.join(__dirname, 'prompt.txt');
        const fileExists = await fs.access(promptFilePath)
                .then(() => true)
                .catch(() => false);
        if (!fileExists) {
            return res.status(500).json({ error: 'Internal Server Error: file processing failed.' });
        }
        const prompt = await fs.readFile(promptFilePath, 'utf-8');
        
        // Send the file and prompt to the processing API
        const result = await model.generateContent([
            {
                inlineData: {
                    data: encodedFile,
                    mimeType: "text/plain",
                },
            },
            prompt
        ]);
        console.log(result.response.text());
        
        res.json({ questions: result.response.text() });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ error: 'Internal Server Error:\n'+error.toString() });
    }
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// app.use((err, req, res, next) => {
//     console.error(JSON.stringify(err));
//     res.status(500).json({ error: 'Internal Server Error Bruh'+err.toString() });
// });

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app; // Export the Express app
