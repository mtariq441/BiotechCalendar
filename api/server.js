import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let handler;

export default async function(req, res) {
  if (!handler) {
    const { default: serverBundle } = await import('../dist/index.js');
    handler = serverBundle;
  }
  
  return handler(req, res);
}
