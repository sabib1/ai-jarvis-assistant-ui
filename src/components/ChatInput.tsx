"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatInput() {
  const [textInput, setTextInput] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const responseAudioRef = useRef<HTMLAudioElement | null>(null);
  const continuousTranscriptRef = useRef<string>("");

  // Initialize response audio element
  useEffect(() => {
    responseAudioRef.current = new Audio();
    return () => {
      if (responseAudioRef.current) {
        responseAudioRef.current.pause();
        responseAudioRef.current = null;
      }
    };
  }, []);

  // Convert audio blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Save response to database
  const saveResponseToDatabase = async (transcript: string, audioBase64: string) => {
    try {
      await fetch('/api/arcee-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_transcript: transcript,
          audio_url: audioBase64
        })
      });
      
      // Dispatch custom event to refresh transcripts
      window.dispatchEvent(new CustomEvent('arcee-response-added'));
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  // Send text to webhook
  const sendTextToWebhook = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('https://cst-n8n-pboxjbol.usecloudstation.com/webhook/367c716d-1649-4373-a1b5-c9cac073b947', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text })
      });
      
      if (response.ok) {
        // Extract audio transcript from response header
        const audioTranscript = response.headers.get('Text') || text;
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Convert audio blob to base64 for database storage
        const audioBase64 = await blobToBase64(audioBlob);
        
        // Save to database
        await saveResponseToDatabase(audioTranscript, audioBase64);
        
        if (responseAudioRef.current) {
          responseAudioRef.current.src = audioUrl;
          setIsSpeaking(true);
          await responseAudioRef.current.play();
          
          responseAudioRef.current.onended = () => {
            URL.revokeObjectURL(audioUrl);
            setIsProcessing(false);
            setIsSpeaking(false);
          };
          
          responseAudioRef.current.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            setIsProcessing(false);
            setIsSpeaking(false);
          };
        }
      }
    } catch (error) {
      console.error('Error sending to webhook:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
    }
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      sendTextToWebhook(textInput);
      setTextInput("");
    }
  };

  // Handle voice toggle
  const toggleVoice = () => {
    if (isVoiceActive) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Start continuous voice recording
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        continuousTranscriptRef.current = finalTranscript.trim();
        sendTextToWebhook(finalTranscript.trim());
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        if (isVoiceActive) {
          setTimeout(() => {
            if (recognitionRef.current && isVoiceActive) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      }
    };
    
    recognition.onend = () => {
      if (isVoiceActive) {
        setTimeout(() => {
          if (recognitionRef.current && isVoiceActive) {
            recognitionRef.current.start();
          }
        }, 100);
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
    setIsVoiceActive(true);
  };

  // Stop voice recording
  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceActive(false);
    continuousTranscriptRef.current = '';
  };

  return (
    <>
      <style>{`
        .container-ia-chat {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: end;
          width: 300px;
        }

        .input-text {
          max-width: 190px;
          width: 100%;
          margin-left: 0;
          padding: 0.75rem 1rem;
          padding-right: 46px;
          border-radius: 50px;
          border: none;
          outline: none;
          background-color: #e9e9e9;
          color: #4c4c4c;
          font-size: 14px;
          line-height: 18px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-weight: 500;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.05);
          z-index: 999;
        }

        .input-text::placeholder {
          color: #959595;
        }

        .input-text:focus-within,
        .input-text:not(:placeholder-shown) {
          max-width: 250px;
        }

        .input-text::selection {
          background-color: #4c4c4c;
          color: #e9e9e9;
        }

        .input-text:not(:placeholder-shown) ~ .label-text {
          transform: translateX(0) translateY(-50%) scale(1);
          opacity: 1;
          visibility: visible;
          pointer-events: all;
        }

        .input-text:not(:placeholder-shown) ~ .label-voice {
          transform: translateX(0) translateY(-50%) scale(0.25);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .input-voice {
          display: none;
        }

        .input-voice:checked ~ .label-voice {
          background-color: #e9e9e9;
          right: 0;
          width: 300px;
          height: 300px;
          border-radius: 3rem;
          box-shadow:
            0 10px 40px rgba(0, 0, 60, 0.25),
            inset 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .input-voice:checked ~ .label-voice .icon-voice {
          opacity: 0;
        }

        .input-voice:checked ~ .label-voice .text-voice p {
          opacity: 1;
        }

        .label-voice,
        .label-text {
          position: absolute;
          top: 50%;
          right: 0.25rem;
          transform: translateX(0) translateY(-50%) scale(1);
          width: 36px;
          height: 36px;
          display: flex;
          padding: 6px;
          border: none;
          outline: none;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.05);
          z-index: 999;
        }

        .label-voice {
          color: #959595;
          overflow: hidden;
        }

        .label-voice:hover,
        .label-voice:focus-visible {
          color: #4c4c4c;
        }

        .label-voice:active svg {
          scale: 1.1;
        }

        .label-voice .icon-voice {
          position: absolute;
          transition: all 0.3s;
        }

        .label-voice .text-voice {
          position: absolute;
          inset: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .label-voice .text-voice p {
          opacity: 0;
          transition: all 0.3s;
          text-wrap: nowrap;
        }

        .label-voice .text-voice p:first-child {
          font-size: 20px;
          font-weight: 500;
          color: transparent;
          background-image: linear-gradient(
            -40deg,
            #959595 0% 35%,
            #e770cd 40%,
            #ffcef4 50%,
            #e770cd 60%,
            #959595 65% 100%
          );
          background-clip: text;
          background-size: 900px;
          animation: text-light 6s ease infinite;
        }

        .label-voice .text-voice p:last-child {
          font-size: 12px;
          color: #2b2b2b;
          mix-blend-mode: difference;
        }

        @keyframes text-light {
          0% {
            background-position: 0px;
          }
          100% {
            background-position: 900px;
          }
        }

        .label-text {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(-50%) scale(0.25);
          color: #e9e9e9;
          background: linear-gradient(to top right, #9147ff, #ff4141);
          box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.5);
          border-radius: 50px;
        }

        .label-text:hover,
        .label-text:focus-visible {
          transform-origin: top center;
          box-shadow: inset 0 0 6px rgba(255, 255, 255, 1);
        }

        .label-text:active {
          scale: 0.9;
        }

        .ai {
          --z: 0;
          --s: 300px;
          --p: calc(var(--s) / 4);
          width: var(--s);
          aspect-ratio: 1;
          padding: var(--p);
          display: grid;
          place-items: center;
          position: relative;
          animation: circle1 5s ease-in-out infinite;
        }

        .ai::before,
        .ai::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50%;
          height: 50%;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 30px rgba(234, 170, 255, 1);
          filter: blur(5px);
          transform: translate(-50%, -50%);
          animation: wave 1.5s linear infinite;
        }

        .ai::after {
          animation-delay: 0.4s;
        }

        @keyframes wave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
            box-shadow: 0 0 50px rgba(234, 170, 255, 0.9);
          }
          35% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 1;
          }
          70%,
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
            box-shadow: 0 0 50px rgba(234, 170, 255, 0.3);
          }
        }

        .ai.speaking {
          animation: circle1-speaking 0.8s ease-in-out infinite;
        }

        .ai.speaking::before,
        .ai.speaking::after {
          animation: wave-speaking 0.6s linear infinite;
        }

        .ai.speaking::after {
          animation-delay: 0.2s;
        }

        @keyframes circle1-speaking {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes wave-speaking {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
            box-shadow: 0 0 60px rgba(234, 170, 255, 1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
            box-shadow: 0 0 80px rgba(234, 170, 255, 0.5);
          }
        }

        @keyframes ai1 {
          0% {
            transform: rotate(0deg) translate(50%) scale(0.9);
            opacity: 0;
          }
          25% {
            transform: rotate(90deg) translate(50%) scale(1.8);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) translate(50%) scale(0.7);
            opacity: 0.4;
          }
          75% {
            transform: rotate(270deg) translate(50%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translate(50%) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes ai2 {
          0% {
            transform: rotate(90deg) translate(50%) scale(0.5);
          }
          25% {
            transform: rotate(180deg) translate(50%) scale(1.7);
            opacity: 0;
          }
          50% {
            transform: rotate(270deg) translate(50%) scale(1);
            opacity: 0;
          }
          75% {
            transform: rotate(360deg) translate(50%) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: rotate(450deg) translate(50%) scale(0.5);
            opacity: 1;
          }
        }

        @keyframes ai3 {
          0% {
            transform: rotate(180deg) translate(50%) scale(0.8);
            opacity: 0.8;
          }
          25% {
            transform: rotate(270deg) translate(50%) scale(1.5);
          }
          50% {
            transform: rotate(360deg) translate(50%) scale(0.6);
            opacity: 0.4;
          }
          75% {
            transform: rotate(450deg) translate(50%) scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: rotate(540deg) translate(50%) scale(0.8);
            opacity: 0.8;
          }
        }

        @keyframes ai4 {
          0% {
            transform: rotate(270deg) translate(50%) scale(1);
            opacity: 1;
          }
          25% {
            transform: rotate(360deg) translate(50%) scale(0.7);
          }
          50% {
            transform: rotate(450deg) translate(50%) scale(1.6);
            opacity: 0.5;
          }
          75% {
            transform: rotate(540deg) translate(50%) scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: rotate(630deg) translate(50%) scale(1);
            opacity: 1;
          }
        }

        .c {
          position: absolute;
          width: 300px;
          aspect-ratio: 1;
          border-radius: 50%;
        }

        .c1 {
          background: radial-gradient(50% 50% at center, #c979ee, #74bcd6);
          width: 200px;
          animation: ai1 5.5s linear infinite;
        }

        .c2 {
          background: radial-gradient(50% 50% at center, #ef788c, #e7e7fb);
          width: 100px;
          animation: ai2 6s linear infinite;
        }

        .c3 {
          background: radial-gradient(50% 50% at center, #eb7fc6, transparent);
          width: 150px;
          opacity: 0.6;
          animation: ai3 4.8s linear infinite;
        }

        .c4 {
          background: #6d67c8;
          animation: ai4 5.2s linear infinite;
        }

        .container {
          overflow: hidden;
          background: #b6a9f8;
          width: 100%;
          border-radius: 50%;
          aspect-ratio: 1;
          position: relative;
          display: grid;
          place-items: center;
        }

        .glass {
          overflow: hidden;
          position: absolute;
          inset: calc(var(--p) - 4px);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          box-shadow:
            0 0 50px rgba(255, 255, 255, 0.3),
            0 50px 50px rgba(0, 0, 0, 0.3),
            0 0 25px rgba(255, 255, 255, 1);
          background: radial-gradient(
            75px at 70% 30%,
            rgba(255, 255, 255, 0.7),
            transparent
          );
        }

        .rings {
          aspect-ratio: 1;
          border-radius: 50%;
          position: absolute;
          inset: 0;
          perspective: 11rem;
          opacity: 0.9;
        }

        .rings:before,
        .rings:after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255, 0, 0, 1);
          border-radius: 50%;
          border: 6px solid transparent;
          mask:
            linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          background: linear-gradient(white, blue, magenta, violet, lightyellow)
            border-box;
          mask-composite: exclude;
        }

        .rings::before {
          animation: ring180 10s ease-in-out infinite;
        }

        .rings::after {
          animation: ring90 10s ease-in-out infinite;
        }

        @keyframes ring180 {
          0% {
            transform: rotateY(180deg) rotateX(180deg) rotateZ(180deg);
          }
          25% {
            transform: rotateY(180deg) rotateX(180deg) rotateZ(180deg);
          }
          50% {
            transform: rotateY(360deg) rotateX(360deg) rotateZ(360deg);
          }
          80% {
            transform: rotateY(360deg) rotateX(360deg) rotateZ(360deg);
          }
          100% {
            transform: rotateY(540deg) rotateX(540deg) rotateZ(540deg);
          }
        }

        @keyframes ring90 {
          0% {
            transform: rotateY(90deg) rotateX(90deg) rotateZ(90deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(90deg) rotateZ(90deg) scale(1.1);
          }
          50% {
            transform: rotateY(270deg) rotateX(270deg) rotateZ(270deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(270deg) rotateZ(270deg);
          }
          100% {
            transform: rotateY(450deg) rotateX(450deg) rotateZ(450deg);
          }
        }

        @keyframes circle1 {
          0% {
            transform: scale(0.97);
          }
          15% {
            transform: scale(1);
          }
          30% {
            transform: scale(0.98);
          }
          45% {
            transform: scale(1);
          }
          60% {
            transform: scale(0.97);
          }
          85% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.97);
          }
        }
      `}</style>

      <div className="container-ia-chat">
        <input
          type="checkbox"
          name="input-voice"
          id="input-voice"
          className="input-voice"
          checked={isVoiceActive}
          onChange={toggleVoice}
        />
        <input
          type="text"
          name="input-text"
          id="input-text"
          placeholder="Ask Anything..."
          className="input-text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleTextSubmit();
            }
          }}
          disabled={isProcessing}
          title=""
        />
        
        <label htmlFor="input-voice" className="label-voice">
          <svg
            className="icon-voice"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M12 4v16m4-13v10M8 7v10m12-6v2M4 11v2"
            ></path>
          </svg>
          <div className={`ai ${isSpeaking ? 'speaking' : ''}`}>
            <div className="container">
              <div className="c c4"></div>
              <div className="c c1"></div>
              <div className="c c2"></div>
              <div className="c c3"></div>
              <div className="rings"></div>
            </div>

            <div className="glass"></div>
          </div>
          <div className="text-voice">
            <p>{isSpeaking ? 'Arcee Speaking...' : 'Conversation Started'}</p>
            <p>Press to cancel the conversation</p>
          </div>
        </label>
        
        <label htmlFor="input-text" className="label-text" onClick={handleTextSubmit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m5 12l7-7l7 7m-7 7V5"
            ></path>
          </svg>
        </label>
      </div>
    </>
  );
}