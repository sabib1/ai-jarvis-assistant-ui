"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";

interface ArceeResponse {
  id: number;
  audioTranscript: string;
  audioUrl: string;
  createdAt: string;
}

export const ArceeTranscripts = () => {
  const [responses, setResponses] = useState<ArceeResponse[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

  // Fetch all responses on mount
  useEffect(() => {
    fetchResponses();
    
    // Listen for new responses
    const handleNewResponse = () => {
      fetchResponses();
    };
    
    window.addEventListener('arcee-response-added', handleNewResponse);
    
    return () => {
      window.removeEventListener('arcee-response-added', handleNewResponse);
    };
  }, []);

  const fetchResponses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/arcee-responses');
      if (response.ok) {
        const data = await response.json();
        setResponses(data);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (id: number, audioUrl: string) => {
    // Stop currently playing audio
    if (playingId !== null && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause();
      audioRefs.current[playingId].currentTime = 0;
    }

    // If clicking the same audio, toggle play/pause
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    // Create or get audio element
    if (!audioRefs.current[id]) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        console.error('Error playing audio');
        setPlayingId(null);
      };
      audioRefs.current[id] = audio;
    }

    // Play the audio
    setPlayingId(id);
    audioRefs.current[id].play().catch(error => {
      console.error('Error playing audio:', error);
      setPlayingId(null);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-cyan-400 animate-pulse">Loading transcripts...</div>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">No transcripts yet. Start a conversation with Arcee!</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
      {responses.map((response) => (
        <div
          key={response.id}
          className="glass-panel rounded-lg p-4 flex items-start gap-4 hover:bg-cyan-500/10 transition-colors"
        >
          <div className="flex-1">
            <p className="text-foreground text-sm leading-relaxed">
              {response.audioTranscript}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(response.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => playAudio(response.id, response.audioUrl)}
            className={`flex-shrink-0 p-3 rounded-full transition-all ${
              playingId === response.id
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 animate-pulse'
                : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            }`}
            aria-label="Play audio"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};