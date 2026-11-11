import { NextResponse } from 'next/server';
import { createOllama } from "ollama-ai-provider-v2";
import { streamText } from 'ai';

export const maxDuration = 60;

interface RagRequest {
  question: string;
  documents: string[];
}

export async function POST(request: Request) {
  try {
    const { question, documents }: RagRequest = await request.json();
    const llm_name = process.env.NEXT_LLM_NAME ?? 'qwen3.5-raggg';
    const ollama_base_url = process.env.NEXT_OLLAMA_URL ?? 'http://localhost';
    const ollama_port = process.env.NEXT_OLLAMA_PORT ?? '11434';
    const ollama_api_url = `${ollama_base_url}:${ollama_port}/api`;

    // 1. Formatta i documenti
    const contextBlock = documents
      .join('\n');

    // 2. Costruisci il prompt con i tag di delimitazione
    const finalPrompt = `
      [CONTEXT]
      ${contextBlock}
      [/CONTEXT]

      [USER]
      ${question}
      [/USER]
    `;

    // L'URL di default di Ollama è http://localhost:11434/api
    const ollamaProvider = createOllama({ baseURL: ollama_api_url});

    // 3. Richiedi lo stream a Ollama usando il modello 'qwen3.5-rag'
    const { textStream } = await streamText({
      model: ollamaProvider(llm_name),
      providerOptions: { ollama: { think: false } },
      prompt: finalPrompt,
    });

    // 4. Trasforma lo stream di Ollama in un ReadableStream
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    // Ritorna la risposta in streaming con le intestazioni corrette
    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Errore durante la generazione RAG:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
