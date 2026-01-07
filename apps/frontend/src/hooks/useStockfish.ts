import { useEffect, useState, useCallback } from 'react';

const STOCKFISH_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.js';

export function useStockfish() {
  const [engine, setEngine] = useState<Worker | null>(null);
  const [bestMove, setBestMove] = useState<string | null>(null);
  // const [evaluation, setEvaluation] = useState<string | null>(null);

  useEffect(() => {
    // Create a blob to load the worker from a cross-origin URL
    const workerCode = `importScripts('${STOCKFISH_CDN_URL}');`;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (event) => {
      const line = event.data;
      // console.log('Stockfish:', line);

      if (line.startsWith('bestmove')) {
        const move = line.split(' ')[1];
        setBestMove(move);
      }

      // if (line.includes('cp ')) {
      //     // rough parsing for evaluation
      //     // user might want detailed parsing later
      // }
    };

    setEngine(worker);
    worker.postMessage('uci');
    worker.postMessage('isready');

    return () => {
      worker.terminate();
    };
  }, []);

  const evaluatePosition = useCallback(
    (fen: string, depth: number = 10) => {
      if (!engine) return;
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage(`go depth ${depth}`);
    },
    [engine]
  );

  return {
    engine,
    evaluatePosition,
    bestMove,
  };
}
