# Softcery Voice Agent

Softcery Voice Agent is a voice-enabled application designed to assist users in discussing product ideas. It leverages a combination of modern web technologies and voice processing tools to provide an interactive and engaging user experience.

## Table of Contents

- [Softcery Voice Agent](#softcery-voice-agent)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Introduction](#introduction-1)
    - [STT/LLM/TTS](#sttllmtts)
  - [Features](#features)
  - [Components](#components)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Environment Variables](#environment-variables)

## Introduction
## Introduction

Voice agents represent a significant advancement in human-computer interaction, enabling users to communicate with devices using natural language. 

Voice agents are increasingly being integrated into various applications, from virtual assistants and customer service bots to smart home devices and automotive systems. They offer the potential to revolutionize how we interact with technology, making it more accessible and user-friendly.

### STT/LLM/TTS
1. **STT** (the "ears" of the system): Converts audio into text.
   - Providers: **Deepgram**, **Amazon Transcribe**, **Google Speech-to-Text**, **Microsoft Azure Speech Service**
2. **LLM** (the "brain" of the system): Processes transcribed text and generates a response.
   - Providers: **OpenAI’s GPT**, **Anthropic’s Claude**, **Meta’s LLaMA**, **Google’s Gemini**
3. **TTS** (the "voice" of the system): Synthesizes text into spoken audio.
   - Providers: **Deepgram**, **Cartesia**, **Microsoft Azure Speech Synthesis**

Each service in this setup is accessed through RESTful or WebSocket APIs, creating a multi-step process with potential latency due to network communication and processing.

![image](https://github.com/user-attachments/assets/f1466f51-c01f-424e-821e-e8c4550a1976)

## Features

- **Voice Interaction**: Engage with the application using voice commands.
- **Rate Limiting**: Prevents abuse by limiting the number of requests per user.
- **Real-time Audio Visualization**: Visual feedback for audio input and output.
- **Speech-to-Text Conversion**: Utilizes Deepgram to transform spoken language into text for further processing.
- **Text-to-Speech Synthesis**: Employs Cartesia to convert text responses into natural-sounding speech.
- **Real-time Communication Management**: Uses LiveKit to handle real-time interactions and participant events efficiently.
- **Advanced Language Processing**: Leverages Llama3 with OpenAI Groq for processing and generating text-based responses.

## Components

- **Agent**: 
  - Uses Flask to create API endpoints for token generation.
  - Rate limiter: Limits both API requests for token generation and voice requests within a single session through LiveKit RTC connection.
  - Integrates with external voice processing services, including Deepgram and Cartesia.

- **Web Client**:
  - Utilizes LiveKit React SDK for real-time communication.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/softcery/softcery-agent.git
   cd softcery-agent
   ```

2. **Agent Setup**:
   - Navigate to the `agent` directory.
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
     ```

3. **Web Client Setup**:
   - Navigate to the `web` directory.
   - Install the dependencies:
     ```bash
     npm install
     ```

## Usage

1. **Start the Token Server**:
   ```bash
   python main.py # from `agent` directory
   ```

2. **Start Voice Agent LiveKit worker**:
   ```bash
   python voice_agent.py dev # from `agent` directory
   ```

3. **Start the Web Client**:
   ```bash
   npm run dev # from `web` directory
   ```

## Environment Variables

The application requires several environment variables to be set. Create a `.env` file in the `agent` and `web` directories. Examples of these environment variables can be found in the `.env.template.sh` files.
