// Restored from ref/webview/assets/global-dictation-orb-D5sxKQB_.js

import { useEffect, useRef, useState, type RefObject } from "react";
export interface UseOrbWaveformOptions {
  variant?: "orb" | "scrolling" | "compact" | "centered";
}
export interface UseOrbWaveformResult {
  waveformCanvasRef: RefObject<HTMLCanvasElement | null>;
  startWaveformCapture: (stream: MediaStream) => void;
  stopWaveformCapture: () => void;
  resetWaveformDisplay: () => void;
}

/**
 * Lightweight waveform visualizer used by the global dictation orb while
 * microphone input is active.
 */
export function useOrbWaveform(
  options: UseOrbWaveformOptions = {},
): UseOrbWaveformResult {
  const { variant = "scrolling" } = options;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const amplitudesRef = useRef<number[]>([]);
  const clearCanvas = (): void => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext("2d");
    if (ctx == null) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const drawOrb = (): void => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext("2d");
    if (ctx == null) return;
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;
    canvas.width = clientWidth * dpr;
    canvas.height = clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const barWidth = 3 * dpr;
    const gap = 2 * dpr;
    const barCount = Math.max(1, Math.floor(clientWidth / (barWidth + gap)));
    while (amplitudesRef.current.length < barCount) {
      amplitudesRef.current.push(0.1);
    }
    while (amplitudesRef.current.length > barCount) {
      amplitudesRef.current.pop();
    }
    const centerY = canvas.height / 2;
    const color = getComputedStyle(canvas).color || "#fff";
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    for (let i = 0; i < barCount; i += 1) {
      const amp =
        0.08 + Math.min(1, Math.max(0, amplitudesRef.current[i] ?? 0)) * 0.92;
      const height = canvas.height * amp * 0.6;
      const x =
        i * (barWidth + gap) -
        (barCount * (barWidth + gap)) / 2 +
        canvas.width / 2;
      const radius = Math.min(barWidth / 2, height / 2);
      ctx.beginPath();
      ctx.roundRect(x, centerY - height / 2, barWidth, height, radius);
      ctx.fill();
    }
    ctx.restore();
  };
  const drawFrame = (): void => {
    if (variant === "orb") {
      drawOrb();
    } else {
      clearCanvas();
    }
    animationRef.current = requestAnimationFrame(drawFrame);
  };
  const resetWaveformDisplay = (): void => {
    amplitudesRef.current = [];
    clearCanvas();
  };
  const stopWaveformCapture = (): void => {
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    processorRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
  };
  const startWaveformCapture = (stream: MediaStream): void => {
    stopWaveformCapture();
    resetWaveformDisplay();
    const AudioContextCtor = window.AudioContext;
    if (AudioContextCtor == null) return;
    const ctx = new AudioContextCtor();
    audioContextRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    sourceRef.current = source;
    const processor = ctx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < input.length; i += 1) {
        const value = Math.abs(input[i] ?? 0);
        sum += value * value;
      }
      const rms = Math.sqrt(sum / Math.max(1, input.length));
      amplitudesRef.current.push(rms);
      if (amplitudesRef.current.length > 24) {
        amplitudesRef.current.shift();
      }
    };
    source.connect(processor);
    processor.connect(ctx.destination);
    animationRef.current = requestAnimationFrame(drawFrame);
  };
  useEffect(() => {
    return () => {
      stopWaveformCapture();
    };
  }, []);
  return {
    waveformCanvasRef: canvasRef,
    startWaveformCapture,
    stopWaveformCapture,
    resetWaveformDisplay,
  };
}
