'use server';

import { extractText } from 'unpdf';

export async function parsePdf(file: File) {
  const buffer = await file.arrayBuffer();
  
  // Ecco tutto il codice necessario per leggere il PDF:
  const { text } = await extractText(buffer, { mergePages: true });
  
  return text;
}