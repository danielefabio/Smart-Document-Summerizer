# Smart Document Summarizer

A web application for chatting with a local AI about PDF documents. The app extracts text from uploaded PDFs with `unpdf` and sends it, together with each question, to a local Ollama model. Responses are streamed to the chat.

## Features

- **PDF upload and text extraction:** Upload PDF files and extract their text.
- **Natural-language questions:** Ask questions about the uploaded documents.
- **Local AI inference:** Generate responses using a model served by Ollama.
- **Multiple documents:** Ask questions across several uploaded documents in the same conversation.
- **Chat reset:** Clear the current conversation and its uploaded documents.

> **Note:** The app extracts text from PDFs but does not include OCR (optical character recognition) for scanned documents that contain only images.

## Requirements

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Ollama](https://ollama.com/)

## Development setup

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. If Ollama is not already running, start it:

   ```bash
   ollama serve
   ```

   Ollama listens on port `11434` by default. If you use a different address or port, update `NEXT_OLLAMA_URL` and `NEXT_OLLAMA_PORT` in `.env`.

4. Download the base model and create the model defined by the repository's `Modelfile`:

   ```bash
   ollama pull qwen3.5:9b
   ollama create qwen3.5-rag -f Modelfile
   ```

   Set `NEXT_LLM_NAME` in `.env` to the name of the model you created:

   ```dotenv
   NEXT_LLM_NAME="qwen3.5-rag"
   NEXT_OLLAMA_URL=http://localhost
   NEXT_OLLAMA_PORT=11434
   ```

   `NEXT_OLLAMA_URL` is the base URL without a trailing slash or port; the app adds the configured port and Ollama API path.

5. Start the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Name displayed in the interface. |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Description displayed in the interface. |
| `NEXT_PUBLIC_APP_VERSION` | Version included in the page title. |
| `NEXT_LLM_NAME` | Name of the Ollama model used by the API. |
| `NEXT_OLLAMA_URL` | Ollama base URL, without a trailing slash or port. |
| `NEXT_OLLAMA_PORT` | Ollama API port. Defaults to `11434`. |

Values prefixed with `NEXT_PUBLIC_` are exposed to the browser; do not store secrets in them. The local `.env` file is ignored by Git.

## Available commands

```bash
pnpm dev      # Start the development server
pnpm build    # Build the application for production
pnpm start    # Start the production server
pnpm lint     # Run ESLint
pnpm test     # Run Playwright tests

```

For a production deployment, build and start the app with:

```bash
pnpm build
pnpm start
```

The app is available at `http://localhost:3000` by default. To use another port, set Next.js's `PORT` environment variable.

To keep the production process running with PM2:

```bash
npm install -g pm2
pm2 start pnpm --name "smart-document-summarizer" -- start
pm2 startup
# Run the command printed by `pm2 startup`, then save the process list:
pm2 save
```

## Project structure

- `app/`: pages, layout, PDF text extraction, and the API route that connects to Ollama and streams the response.
- `components/`: chat interface, document list, and UI components.
- `lib/`: shared helper functions.
- `Modelfile`: Ollama model configuration, including its system prompt and parameters.
