# AlpineSight

AlpineSight is a multimodal AI chat application that combines natural language interaction with visual tools. It features an interactive 3D globe for location-based queries and integrates computer vision models for object detection in images, providing an immersive and context-aware user experience.

## Features

- **AI Chat:** A conversational interface powered by large language models via OpenRouter, using the Vercel AI SDK for seamless streaming.
- **Interactive 3D Globe:** Visualize locations anywhere on Earth. The AI can plot markers and fly to specific coordinates in response to user prompts.
- **Multimodal Input:** Analyze images provided by the user.
- **Object Detection:** Utilizes YOLO models, converted to ONNX for efficient in-browser inference, to detect objects in images.
- **Streaming API:** A robust backend built with Python and FastAPI that streams AI responses and tool calls to the Next.js frontend.
- **Tool-Using AI:** The AI can use tools to show locations on the globe, with plans to support more complex actions.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI
- **AI:** Vercel AI SDK, OpenRouter
- **Globe Visualization:** `react-globe.gl`, `three.js`
- **Computer Vision:** YOLO, ONNX Runtime Web
- **Deployment:** Vercel

## Getting Started

To run AlpineSight locally, follow these steps:

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd alpinesight-app
```

### 2. Set up environment variables

Create a `.env.local` file in the root of the project and add your API keys. You can use `.env.local.template` as a starting point.

```dotenv
# .env.local
OPENROUTER_API_KEY=sk-or-v1-YOUR_API_KEY
```

### 3. Install dependencies

This project uses `pnpm` for the frontend and `pip` for the Python backend.

**Install Node.js dependencies:**

```bash
pnpm install
```

**Install Python dependencies:**

It's recommended to use a virtual environment.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Run the development server

The application consists of a Next.js frontend and a FastAPI backend. The `dev` script runs both concurrently.

```bash
pnpm dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/m-d-a-r/alpinesight)

When deploying to Vercel, make sure to set the required environment variables in the project settings.

