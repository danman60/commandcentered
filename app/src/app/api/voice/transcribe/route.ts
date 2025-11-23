import { NextRequest, NextResponse } from 'next/server';

/**
 * Voice Transcription API
 *
 * Transcribes audio using OpenAI's Whisper API
 * - Accepts base64 encoded audio (webm format from browser MediaRecorder)
 * - Converts to blob and sends to Whisper
 * - Returns transcribed text
 *
 * API Documentation: https://platform.openai.com/docs/api-reference/audio/createTranscription
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audio } = body;

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio provided' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        {
          error: 'OpenAI not configured',
          transcription: '',
          message: 'Voice transcription requires OPENAI_API_KEY environment variable.',
        },
        { status: 503 }
      );
    }

    // Convert base64 to blob
    const base64Data = audio.split(',')[1];
    const audioBuffer = Buffer.from(base64Data, 'base64');

    // Create FormData for Whisper API
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Optional: can be auto-detected
    formData.append('response_format', 'json');

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Whisper API error:', errorText);
      return NextResponse.json(
        {
          error: 'Transcription failed',
          transcription: '',
          message: `OpenAI API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const transcription = data.text || '';

    return NextResponse.json({
      success: true,
      transcription,
      message: 'Transcription successful',
    });
  } catch (error: any) {
    console.error('Voice transcription error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        transcription: '',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
