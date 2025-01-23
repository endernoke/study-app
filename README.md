> Check out the `prototype` branch for a working basic prototype of the app.

# StudyCards AI

Generate study questions from your learning materials using LLM. Upload your study documents and get AI-generated multiple-choice questions or flashcards to help you learn.

> It's finals week but I don't feel like studying.

## Built With

- Frontend: React.js, Vite
- Backend: Node.js, Express
- Google Gemini API

## Features

- Upload study materials (PDF, TXT, RTF, MD files)
- Generate multiple-choice questions or flashcards
- Customize number of questions
- Add context for focused question generation
- Mobile-responsive design
- Interactive and smooth UI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/endernoke/study-app.git
cd study-app
git checkout prototype
```

2. Install dependencies:
```
npm install
cd client && npm install
cd ..
```

3. Create a `.env` file in the root directory and add your Google Gemini API key:
```
GENAI_API_KEY=your_api_key_here
```
  You can get a free API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key).

4. In the root directory, build the client and start the server:
```
npm run --prefix ./client build
npm start
```

The app will be running at `http://localhost:5000`. Paste this into your browser and start studying!

## Usage

1. Navigate to the Questions tab
2. Click the Upload button
3. Choose your study material file
4. Select question format (Multiple Choice/Flashcards)
5. Set number of questions
6. Optionally add specific topics
7. Click Upload to generate questions

> ⚠️ **Important**: The Google Gemini API is not available in certain regions, e.g. China Mainland, Hong Kong, Russia.
  If you are in one of these regions, you will need to use a VPN to use the app.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Please fork the repo first before making changes.

## License

This project is licensed under the MIT License.

## Credits
[James Zheng](www.linkedin.com/in/james-zheng-zi)