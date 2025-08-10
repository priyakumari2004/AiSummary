# Meeting Summary Generator

AI-powered meeting transcription and summarization app that transforms your video/audio/text meeting files into actionable insights using OpenAI APIs.

## Overview

This app lets users upload meeting recordings in video, audio, or text format and generates accurate transcriptions and structured summaries. It leverages OpenAI's Whisper API for speech-to-text transcription and GPT-4o for summarization.

##  Tech Stack

1. Frontend: React 18 with TypeScript for robust and scalable UI development
2. Styling: Tailwind CSS for fast, utility-first responsive design
3. Build tool: Vite for lightning-fast development and bundling
4. Video processing: moviepy for server-side audio extraction from videos
5. Speech-to-text: OpenAI Whisper API integration for accurate transcription
6. Summarization: OpenAI GPT-4o API for generating meeting summaries
7. Configuration: dotenv for secure management of API keys and environment variables
8. Backend: Python Flask for lightweight REST API development

## Architecture and Flow

1. **User uploads a meeting file** (video/audio/text) via frontend UI.
2. **Frontend initializes processing steps** based on file type.
3. If video:
   - Frontend sends video file to backend `/extract-audio` endpoint.
   - Backend extracts audio using `moviepy` and returns audio file.
4. Frontend sends audio file to backend `/transcribe` endpoint.
5. Backend transcribes audio using OpenAI Whisper API.
6. Frontend sends transcript text to backend `/summarize` endpoint.
7. Backend generates summary using OpenAI GPT-4o API.
8. Frontend displays transcription and summary to user.
9. User can download summary as a `.txt` file

## Dashboard
![Homepage](images/Screenshot(41).png)
![Homepage](images/Screenshot(42).png)
![Summary page](images/Screenshot(42).png)

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- Python 3.8+
- OpenAI API key ([Get from OpenAI](https://platform.openai.com/api-keys))

### Backend Setup

```bash
# Create and activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install flask python-dotenv openai moviepy

# Create a `.env` file and add your OpenAI API key:
echo OPENAI_API_KEY=your_openai_api_key_here > .env

# Run the backend server
python app.py
