'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicrophoneFABProps {
  className?: string;
  onTranscription?: (text: string) => void;
  onCommand?: (command: any) => void;
}

export function MicrophoneFAB({ className, onTranscription, onCommand }: MicrophoneFABProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isListening && !isProcessing) {
          startRecording();
        } else if (isListening) {
          stopRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, isProcessing]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        // Send to API for transcription
        const response = await fetch('/api/voice/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();

        setTranscription(data.transcription);
        onTranscription?.(data.transcription);

        // Parse command
        if (data.command) {
          onCommand?.(data.command);
        }

        setIsProcessing(false);

        // Clear transcription after 5 seconds
        setTimeout(() => setTranscription(''), 5000);
      };
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process voice command');
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopRecording();
    } else if (!isProcessing) {
      startRecording();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        disabled={isProcessing}
        className={cn(
          'fixed bottom-6 right-6 z-[9999]',
          'w-14 h-14 rounded-full',
          'flex items-center justify-center',
          'transition-all duration-200',
          'shadow-lg hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          isListening && 'animate-pulse bg-red-500 hover:bg-red-600',
          !isListening && !isProcessing && 'tactical-button-primary',
          isProcessing && 'bg-gray-500 cursor-not-allowed',
          className
        )}
        aria-label={isListening ? 'Stop recording' : 'Start voice command'}
        title={isListening ? 'Click to stop (or press Cmd/Ctrl+K)' : 'Click to speak (or press Cmd/Ctrl+K)'}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : isListening ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Transcription Display */}
      {(transcription || error) && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-[9998]',
            'max-w-sm p-4 rounded-lg',
            'tactical-panel',
            'animate-in slide-in-from-bottom-4 duration-300'
          )}
        >
          {error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <div>
              <p className="text-xs text-gray-400 mb-1">Transcription:</p>
              <p className="text-sm text-white">{transcription}</p>
            </div>
          )}
        </div>
      )}

      {/* Recording Indicator */}
      {isListening && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-[9998]',
            'px-4 py-2 rounded-lg',
            'bg-red-500/20 border border-red-500/50',
            'animate-pulse'
          )}
        >
          <p className="text-sm text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Recording...
          </p>
        </div>
      )}
    </>
  );
}
