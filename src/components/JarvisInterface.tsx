"use client";

import { useEffect, useState, useRef } from "react";
import { Settings, Trash2, Download, EyeOff, X, Minus, Database, Cloud, Calculator, Clock, MessageSquare, Calendar, Upload, Image, Palette, Music, Play, Pause, Volume2, FileCode, Mic } from "lucide-react";

// ... keep existing interfaces ...

interface Message {
  id: number;
  responseText: string;
  createdAt: string;
}

interface Photo {
  id: number;
  photoUrl: string;
  isMain: boolean;
  createdAt: string;
}

interface Theme {
  id: number;
  name: string;
  cssCode: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MusicFile {
  id: string;
  name: string;
  url: string;
  duration: number;
}

interface CustomFunction {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export default function JarvisInterface() {
  // ... keep existing state ...
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [orbState, setOrbState] = useState<"idle" | "active" | "processing">("idle");
  const [visionActive, setVisionActive] = useState(true);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [leftActivePanel, setLeftActivePanel] = useState<string | null>(null);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  const [calcNoNewNumber, setCalcNewNumber] = useState(true); // Corrected variable name
  const [systemStats, setSystemStats] = useState({
    cpu: 8,
    ram: 11.2,
    memory: 70,
    disk: "383/476 GB"
  });
  
  // Weather data states
  const [weatherData, setWeatherData] = useState<any>(undefined);
  const [temp, setTemp] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [humidity, setHumidity] = useState<number | undefined>(undefined);
  const [windSpeed, setWindSpeed] = useState<number | undefined>(undefined);
  
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [arceePhoto, setArceePhoto] = useState<string>("");
  const [isLoadingMainPhoto, setIsLoadingMainPhoto] = useState(true);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPhotosGallery, setShowPhotosGallery] = useState(false);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSettingMainPhoto, setIsSettingMainPhoto] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState("");
  const [isSettingUrlPhoto, setIsSettingUrlPhoto] = useState(false);
  
  // Theme states
  const [showThemesModal, setShowThemesModal] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeCss, setNewThemeCss] = useState("");
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [isDeletingTheme, setIsDeletingTheme] = useState(false);
  const [isClearingMain, setIsClearingMain] = useState(false);

  // Music states
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [currentMusic, setCurrentMusic] = useState<MusicFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [rightActivePanel, setRightActivePanel] = useState<'messages' | 'music'>('messages');

  // Background music detection state
  const [bgMusicData, setBgMusicData] = useState<{
    title: string;
    artist: string;
    currentTime: string;
    totalDuration: string;
    isPlaying: boolean;
  } | null>(null);

  // Photo position dragging states
  const [photoPosition, setPhotoPosition] = useState({ x: 50, y: 50 }); // center by default
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, photoX: 50, photoY: 50 });

  // Custom Functions states
  const [showFunctionsModal, setShowFunctionsModal] = useState(false);
  const [customFunctions, setCustomFunctions] = useState<CustomFunction[]>([]);
  const [isLoadingFunctions, setIsLoadingFunctions] = useState(false);
  const [showNewFunctionForm, setShowNewFunctionForm] = useState(false);
  const [newFunctionName, setNewFunctionName] = useState("");
  const [newFunctionCode, setNewFunctionCode] = useState("");
  const [isSavingFunction, setIsSavingFunction] = useState(false);
  const [isDeletingFunction, setIsDeletingFunction] = useState(false);
  const [editingFunction, setEditingFunction] = useState<CustomFunction | null>(null);

  // Voice input states
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recordingAnimation, setRecordingAnimation] = useState(false);
  const recognitionRef = useRef<any>(null);
  const responseAudioRef = useRef<HTMLAudioElement | null>(null);

  // ... keep existing refs ...
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load main theme on mount
  useEffect(() => {
    const loadMainTheme = async () => {
      try {
        const response = await fetch('/api/themes/main');
        if (response.ok) {
          const mainTheme = await response.json();
          applyTheme(mainTheme.cssCode);
        }
        // If 404 (no main theme), do nothing - default styling applies
      } catch (error) {
        console.error('Error loading main theme:', error);
      }
    };
    
    loadMainTheme();
  }, []);

  // Fetch themes from database
  const fetchThemes = async () => {
    setIsLoadingThemes(true);
    try {
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        setThemes(data);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoadingThemes(false);
    }
  };

  // Apply theme by injecting CSS into page
  const applyTheme = (cssCode: string) => {
    // Remove existing custom theme style tag if exists
    const existingStyle = document.getElementById('custom-theme-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create new style tag with theme CSS
    const styleTag = document.createElement('style');
    styleTag.id = 'custom-theme-style';
    styleTag.textContent = cssCode;
    document.head.appendChild(styleTag);
  };

  // Handle theme selection - now also sets as main in database
  const handleThemeSelect = async (theme: Theme) => {
    try {
      // Set as main in database
      const response = await fetch(`/api/themes/${theme.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_main: true })
      });
      
      if (response.ok) {
        // Apply the theme CSS
        applyTheme(theme.cssCode);
        setShowThemesModal(false);
        
        // Refresh themes list to update UI
        fetchThemes();
      }
    } catch (error) {
      console.error('Error setting theme as main:', error);
    }
  };

  // Save new theme to database - automatically sets as main
  const handleSaveNewTheme = async () => {
    if (!newThemeName.trim() || !newThemeCss.trim()) return;
    
    setIsSavingTheme(true);
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newThemeName.trim(), 
          css_code: newThemeCss.trim()
          // is_main defaults to true in the API
        })
      });
      
      if (response.ok) {
        const newTheme = await response.json();
        
        // Apply the new theme immediately
        applyTheme(newTheme.cssCode);
        
        // Reset form and close
        setNewThemeName("");
        setNewThemeCss("");
        setShowNewThemeForm(false);
        
        // Refresh themes list
        fetchThemes();
        
        // Close modal
        setShowThemesModal(false);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setIsSavingTheme(false);
    }
  };

  // Clear main theme - remove all main attributes
  const handleClearMain = async () => {
    setIsClearingMain(true);
    try {
      const response = await fetch('/api/themes/clear-main', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Remove custom theme style tag to revert to default
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        // Refresh themes list
        fetchThemes();
      }
    } catch (error) {
      console.error('Error clearing main theme:', error);
    } finally {
      setIsClearingMain(false);
    }
  };

  // Delete theme from database
  const handleDeleteTheme = async (themeId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the "apply theme" action
    
    setIsDeletingTheme(true);
    try {
      const response = await fetch(`/api/themes/${themeId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh the themes list
        fetchThemes();
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
    } finally {
      setIsDeletingTheme(false);
    }
  };

  // Photo drag handlers
  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      photoX: photoPosition.x,
      photoY: photoPosition.y
    };
    setIsDraggingPhoto(true);
  };

  const handlePhotoTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      photoX: photoPosition.x,
      photoY: photoPosition.y
    };
    setIsDraggingPhoto(true);
  };

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (!isDraggingPhoto) return;
    
    const handlePhotoMouseMove = (e: MouseEvent) => {
      if (!photoContainerRef.current) return;
      
      e.preventDefault();
      
      const rect = photoContainerRef.current.getBoundingClientRect();
      
      // Calculate pixel movement from start position
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      // Convert to percentage movement (larger multiplier for more sensitivity)
      const deltaXPercent = (deltaX / rect.width) * 200; // Increased sensitivity
      const deltaYPercent = (deltaY / rect.height) * 200;
      
      // Apply delta to starting position
      const newX = Math.max(0, Math.min(100, dragStartRef.current.photoX + deltaXPercent));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.photoY + deltaYPercent));
      
      setPhotoPosition({ x: newX, y: newY });
    };

    const handlePhotoMouseUp = () => {
      setIsDraggingPhoto(false);
    };

    const handlePhotoTouchMove = (e: TouchEvent) => {
      if (!photoContainerRef.current) return;
      
      e.preventDefault();
      
      const touch = e.touches[0];
      const rect = photoContainerRef.current.getBoundingClientRect();
      
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;
      
      const deltaXPercent = (deltaX / rect.width) * 200;
      const deltaYPercent = (deltaY / rect.height) * 200;
      
      const newX = Math.max(0, Math.min(100, dragStartRef.current.photoX + deltaXPercent));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.photoY + deltaYPercent));
      
      setPhotoPosition({ x: newX, y: newY });
    };

    const handlePhotoTouchEnd = () => {
      setIsDraggingPhoto(false);
    };
    
    document.addEventListener('mousemove', handlePhotoMouseMove);
    document.addEventListener('mouseup', handlePhotoMouseUp);
    document.addEventListener('touchmove', handlePhotoTouchMove, { passive: false });
    document.addEventListener('touchend', handlePhotoTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handlePhotoMouseMove);
      document.removeEventListener('mouseup', handlePhotoMouseUp);
      document.removeEventListener('touchmove', handlePhotoTouchMove);
      document.removeEventListener('touchend', handlePhotoTouchEnd);
    };
  }, [isDraggingPhoto]);

  // Load saved photo from database on mount
  useEffect(() => {
    const loadMainPhoto = async () => {
      try {
        const response = await fetch('/api/photos/main');
        if (response.ok) {
          const data = await response.json();
          setArceePhoto(data.photoUrl);
        } else if (response.status === 404) {
          // No main photo found, set empty
          setArceePhoto('');
        }
      } catch (error) {
        console.error('Error loading main photo:', error);
        setArceePhoto('');
      } finally {
        setIsLoadingMainPhoto(false);
      }
    };
    
    loadMainPhoto();
  }, []);

  // Fetch all photos from database
  const fetchAllPhotos = async () => {
    setIsLoadingPhotos(true);
    try {
      const response = await fetch('/api/photos');
      if (response.ok) {
        const data = await response.json();
        // Shuffle the photos array to randomize order
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setAllPhotos(shuffled);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  // Handle photo upload with 'main' attribute
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target?.result as string;
        
        try {
          // Upload to database with is_main: true
          const response = await fetch('/api/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photo_url: photoUrl, is_main: true })
          });
          
          if (response.ok) {
            const data = await response.json();
            // Set the photo immediately
            setArceePhoto(data.photoUrl);
            // Reset position to center
            setPhotoPosition({ x: 50, y: 50 });
            setShowPhotoOptions(false);
            
            // Force a refresh of the main photo from the API to ensure consistency
            const refreshResponse = await fetch('/api/photos/main');
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              setArceePhoto(refreshData.photoUrl);
            }
          } else {
            const errorData = await response.json();
            console.error('Error uploading photo:', errorData);
            alert('Failed to upload photo: ' + (errorData.error || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error uploading photo:', error);
          alert('Failed to upload photo. Please try again.');
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Set selected photo as main
  const handleSetPhotoAsMain = async (photoId: number, photoUrl: string) => {
    setIsSettingMainPhoto(true);
    try {
      // Update the existing photo to set is_main: true
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_main: true })
      });
      
      if (response.ok) {
        setArceePhoto(photoUrl);
        setPhotoPosition({ x: 50, y: 50 }); // Reset position
        setShowPhotosGallery(false);
        setShowPhotoOptions(false);
      }
    } catch (error) {
      console.error('Error setting main photo:', error);
    } finally {
      setIsSettingMainPhoto(false);
    }
  };

  // Handle photo deletion
  const handleDeletePhoto = async (photoId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the "set as main" action
    
    setIsDeletingPhoto(true);
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh the gallery
        fetchAllPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  // Fetch responses from database
  const fetchResponses = async (date?: string) => {
    setIsLoadingResponses(true);
    try {
      const url = date 
        ? `/api/responses?date=${date}`
        : '/api/responses/today';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  // Save response to database
  const saveResponse = async (responseText: string) => {
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response_text: responseText })
      });
      
      if (response.ok) {
        // Refresh the list to show new response
        if (selectedDate) {
          fetchResponses(selectedDate);
        } else {
          fetchResponses();
        }
      }
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  // Load today's responses on mount
  useEffect(() => {
    fetchResponses();
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowCalendar(false);
    fetchResponses(date);
  };

  // Clear date filter
  const handleClearDateFilter = () => {
    setSelectedDate("");
    fetchResponses();
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Set to Hindi Indian
      utterance.pitch = 1;
      utterance.rate = 1;
      
      // Set speaking state
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      // Try to use a Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => 
        voice.lang === 'hi-IN' || 
        voice.lang.startsWith('hi') ||
        voice.name.toLowerCase().includes('hindi')
      );
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      
      window.speechSynthesis.speak(utterance);
      console.log('speaking:', text);
    }
  };

  // Global Speak function - speaks and saves to database
  const Speak = (text: string) => {
    // Speak the text
    speak(text);
    
    // Save to database
    saveResponse(text);
    
    // Update orb state
    setOrbState("processing");
    setTimeout(() => setOrbState("active"), 2000);
    setTimeout(() => setOrbState("idle"), 5000);
    
    console.log('Speak called with:', text);
  };

  // Global run function - executes custom JavaScript code
  const run = (code: string) => {
    try {
      // Execute the code
      eval(code);
      console.log('Code executed:', code);
    } catch (error) {
      console.error('Error executing code:', error);
    }
  };

  // Global ParseJSON function - logs string parameter
  const ParseJSON = (aiResponseObject: any) => {
    // Log to the console so you can see exactly what the AI sent.
    console.log("ParseJSON function received:", aiResponseObject);

    // --- 1. Handle the text reply by calling your website's Speak() function ---
    if (aiResponseObject && aiResponseObject.textReply && typeof window.Speak === 'function') {
      console.log(`Calling Speak() with: "${aiResponseObject.textReply}"`);
      (window as any).Speak(aiResponseObject.textReply);
    } else if (aiResponseObject && aiResponseObject.textReply) {
      // This error is helpful if you ever forget to create the Speak function.
      console.warn("AI provided a textReply, but the 'Speak' function was not found on your page.");
    }

    // --- 2. Handle the action ---
    if (aiResponseObject && aiResponseObject.action && typeof aiResponseObject.action === 'string') {
      const functionName = aiResponseObject.action;
      const params = aiResponseObject.actionParams;

      console.log(`AI requested to execute action: "${functionName}"`);

      // Check if the function actually exists on your page (on the 'window' object).
      if ((window as any)[functionName] && typeof (window as any)[functionName] === 'function') {
        
        // --- 3. Handle parameters correctly ---
        if (Array.isArray(params)) {
          // If params is an array, call the function with those params.
          console.log("Calling function with parameters:", params);
          // The '...' spread operator turns the array into separate arguments.
          // For example: ["arg1", "arg2"] becomes function("arg1", "arg2")
          (window as any)[functionName](...params);
        } else {
          // This covers the case where actionParams is 'false', null, or not provided.
          console.log("Calling function with no parameters.");
          (window as any)[functionName]();
        }
      } else {
        console.error(`AI requested action "${functionName}", but this function was not found on your page.`);
      }
    } else {
      // This logs if the AI's response had no action to perform.
      console.log("No action requested by AI.");
    }
  };

  // Make Speak, run and ParseJSON functions globally available
  useEffect(() => {
    (window as any).Speak = Speak;
    (window as any).run = run;
    (window as any).ParseJSON = ParseJSON;
    
    return () => {
      delete (window as any).Speak;
      delete (window as any).run;
      delete (window as any).ParseJSON;
    };
  }, [selectedDate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePasswordSubmit = () => {
    if (password === "786") {
      const url = 'https://zapier.com/app/chatbots/cmgkk93b41mjs0yaediay7n85?tab=instructions';
      
      // Handle iframe compatibility
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      
      setShowPasswordDialog(false);
      setPassword("");
      setPasswordError("");
    } else if (password) {
      // Show error for wrong password
      setPasswordError("Incorrect password");
      setPassword("");
    }
  };

  const handleNumberClick = (num: string) => {
    if (password.length < 10) {
      setPassword(password + num);
      setPasswordError("");
    }
  };

  const handleClear = () => {
    setPassword("");
    setPasswordError("");
  };

  // Calculator functions
  const handleCalcNumber = (num: string) => {
    if (calcNoNewNumber) { // corrected variable name
      setCalcDisplay(num);
      setCalcNewNumber(false);
    } else {
      setCalcDisplay(calcDisplay === "0" ? num : calcDisplay + num);
    }
  };

  const handleCalcOperation = (op: string) => {
    const currentValue = parseFloat(calcDisplay);
    
    if (calcPrevValue !== null && calcOperation && !calcNoNewNumber) {
      handleCalcEquals();
    } else {
      setCalcPrevValue(currentValue);
    }
    
    setCalcOperation(op);
    setCalcNoNewNumber(true); // corrected variable name
  };

  const handleCalcEquals = () => {
    if (calcPrevValue === null || calcOperation === null) return;
    
    const currentValue = parseFloat(calcDisplay);
    let result = 0;
    
    switch (calcOperation) {
      case '+':
        result = calcPrevValue + currentValue;
        break;
      case '-':
        result = calcPrevValue - currentValue;
        break;
      case '*':
        result = calcPrevValue * currentValue;
        break;
      case '/':
        result = calcPrevValue / currentValue;
        break;
    }
    
    setCalcDisplay(result.toString());
    setCalcPrevValue(null);
    setCalcOperation(null);
    setCalcNoNewNumber(true); // corrected variable name
  };

  const handleCalcClear = () => {
    setCalcDisplay("0");
    setCalcPrevValue(null);
    setCalcOperation(null);
    setCalcNoNewNumber(true); // corrected variable name
  };

  const handleCalcDecimal = () => {
    if (calcNoNewNumber) { // corrected variable name
      setCalcDisplay("0.");
      setCalcNoNewNumber(false); // corrected variable name
    } else if (!calcDisplay.includes(".")) {
      setCalcDisplay(calcDisplay + ".");
    }
  };

  // Finding Bypass Data - runs every 200ms
  useEffect(() => {
    const FindingBypassData = () => {
      const response = localStorage.getItem('zapierResponse');
      if (response && response !== 'undefined') {
        speak(response);
        console.log('speaking');
        
        // Save to database
        saveResponse(response);
        
        // Update orb state
        setOrbState("processing");
        setTimeout(() => setOrbState("active"), 2000);
        setTimeout(() => setOrbState("idle"), 5000);
        
        // Reset localStorage
        localStorage.setItem('zapierResponse', 'undefined');
      }
    };

    // Run every 200ms
    const intervalId = setInterval(FindingBypassData, 200);
    
    return () => clearInterval(intervalId);
  }, [selectedDate]);

  // Load voices when available
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Initialize camera
  useEffect(() => {
    if (visionActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log("Camera access denied:", err));
    }
  }, [visionActive]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw rotating rings
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation + i * 30) * Math.PI / 180);
        
        const radius = 60 + i * 30;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 1.5);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.3 - i * 0.05})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
      }

      // Draw center dots
      for (let i = 0; i < 5; i++) {
        const angle = (rotation + i * 72) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * 15;
        const y = centerY + Math.sin(angle) * 15;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.fill();
      }

      rotation += orbState === "processing" ? 4 : orbState === "active" ? 2 : 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [orbState]);

  const extractConversation = () => {
    const conversationText = messages.map(m => 
      `[${new Date(m.createdAt).toLocaleString()}] ARCEE: ${m.responseText}`
    ).join('\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${Date.now()}.txt`;
    a.click();
  };

  const [clockTime, setClockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLeftPanelClick = (panel: string) => {
    if (leftActivePanel === panel) {
      setLeftDrawerOpen(false);
      setLeftActivePanel(null);
    } else {
      setLeftActivePanel(panel);
      setLeftDrawerOpen(true);
    }
  };

  // Handle right panel click - updated to support multiple panels
  const handleRightPanelClick = (panel: 'messages' | 'music') => {
    if (rightActivePanel === panel && rightDrawerOpen) {
      setRightDrawerOpen(false);
      setRightActivePanel('messages');
    } else {
      setRightActivePanel(panel);
      setRightDrawerOpen(true);
    }
  };

  // Handle URL photo submission
  const handleUrlSubmit = async () => {
    if (tempPhotoUrl.trim()) {
      setIsSettingUrlPhoto(true);
      
      // Simulate a small delay to show the loader
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setArceePhoto(tempPhotoUrl);
      setIsSettingUrlPhoto(false);
      setShowUrlInput(false);
      setShowPhotoOptions(false);
      setTempPhotoUrl("");
    }
  };

  // Function to fetch weather data for Dakshin Dinajpur
  const getDakshinDinajpurWeather = async () => {
    const apiKey = '160af852afb765102017c75e0c690a2a';
    const lat = 25.39;
    const lon = 88.75;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
      setTemp(data.main.temp);
      setDescription(data.weather[0].description);
      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);

      // Silent update - no speak for automatic refresh
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Silent error - no speak for automatic refresh
    }
  };

  // Handle manual weather refresh with different Hindi messages
  const handleRefreshWeather = async () => {
    const apiKey = '160af852afb765102017c75e0c690a2a';
    const lat = 25.39;
    const lon = 88.75;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
      setTemp(data.main.temp);
      setDescription(data.weather[0].description);
      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);

      // Speak success message in Hindi for manual refresh
      speak('weather के latest data मिल गया');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Speak error message in Hindi for manual refresh
      speak('Latest weather के data नहीं मिल राहा हैं');
    }
  };

  // Fetch weather data on mount and every 5 minutes
  useEffect(() => {
    // Fetch immediately on mount
    getDakshinDinajpurWeather();
    
    // Set up interval to fetch every 5 minutes (300000ms)
    const intervalId = setInterval(getDakshinDinajpurWeather, 300000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Music file upload handler
  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newMusic: MusicFile = {
          id: Date.now().toString(),
          name: file.name,
          url: url,
          duration: 0
        };
        
        // Get duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          newMusic.duration = audio.duration;
          setMusicFiles(prev => [...prev, newMusic]);
        };
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (musicInputRef.current) {
      musicInputRef.current.value = '';
    }
  };

  // Play music
  const playMusic = (music: MusicFile) => {
    if (audioRef.current) {
      if (currentMusic?.id === music.id) {
        // Toggle play/pause for same song
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        // Play new song
        audioRef.current.src = music.url;
        audioRef.current.play();
        setCurrentMusic(music);
        setIsPlaying(true);
        setCurrentTime(0);
      }
    }
  };

  // Delete music
  const deleteMusic = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMusicFiles(prev => prev.filter(m => m.id !== id));
    if (currentMusic?.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentMusic(null);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Audio time update
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Parse time string (mm:ss to seconds)
  const parseTimeToSeconds = (timeString: string): number => {
    const [mins, secs] = timeString.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
  };

  // Check localStorage for background music every 1 second
  useEffect(() => {
    const checkBackgroundMusic = () => {
      const ytMusicStatus = localStorage.getItem('ytMusicStatus');
      if (ytMusicStatus && ytMusicStatus !== 'undefined') {
        try {
          const data = JSON.parse(ytMusicStatus);
          setBgMusicData({
            title: data.title || 'Unknown Track',
            artist: data.artist || 'Unknown Artist',
            currentTime: data.currentTime || '0:00',
            totalDuration: data.totalDuration || '0:00',
            isPlaying: data.isPlaying || false
          });
        } catch (error) {
          console.error('Error parsing ytMusicStatus:', error);
          setBgMusicData(null);
        }
      } else {
        setBgMusicData(null);
      }
    };

    // Check immediately
    checkBackgroundMusic();
    
    // Then check every 1 second
    const intervalId = setInterval(checkBackgroundMusic, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Seek music
  const seekMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && currentMusic) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Custom Functions - Add/Remove/Update
  const handleAddCustomFunction = async () => {
    if (!newFunctionName.trim() || !newFunctionCode.trim()) return;
    
    setIsSavingFunction(true);
    try {
      const response = await fetch('/api/functions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newFunctionName.trim(), 
          code: newFunctionCode.trim()
        })
      });
      
      if (response.ok) {
        const newFunction = await response.json();
        
        // Add to custom functions list
        setCustomFunctions(prev => [...prev, newFunction]);
        
        // Reset form and close
        setNewFunctionName("");
        setNewFunctionCode("");
        setShowNewFunctionForm(false);
        
        // Refresh functions list
        fetchCustomFunctions();
        
        // Close modal
        setShowFunctionsModal(false);
      }
    } catch (error) {
      console.error('Error saving function:', error);
    } finally {
      setIsSavingFunction(false);
    }
  };

  // Update custom function
  const handleUpdateCustomFunction = async () => {
    if (!editingFunction || !newFunctionName.trim() || !newFunctionCode.trim()) return;
    
    setIsSavingFunction(true);
    try {
      const response = await fetch(`/api/functions/${editingFunction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newFunctionName.trim(), 
          code: newFunctionCode.trim()
        })
      });
      
      if (response.ok) {
        // Reset form and editing state
        setNewFunctionName("");
        setNewFunctionCode("");
        setEditingFunction(null);
        
        // Refresh functions list
        fetchCustomFunctions();
      }
    } catch (error) {
      console.error('Error updating function:', error);
    } finally {
      setIsSavingFunction(false);
    }
  };

  // Delete custom function from database
  const handleDeleteCustomFunction = async (functionId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the "edit function" action
    
    setIsDeletingFunction(true);
    try {
      const response = await fetch(`/api/functions/${functionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Refresh the functions list
        fetchCustomFunctions();
      }
    } catch (error) {
      console.error('Error deleting function:', error);
    } finally {
      setIsDeletingFunction(false);
    }
  };

  // Fetch custom functions from database
  const fetchCustomFunctions = async () => {
    setIsLoadingFunctions(true);
    try {
      const response = await fetch('/api/functions');
      if (response.ok) {
        const data = await response.json();
        setCustomFunctions(data);
      }
    } catch (error) {
      console.error('Error fetching functions:', error);
    } finally {
      setIsLoadingFunctions(false);
    }
  };

  // Load custom functions on mount
  useEffect(() => {
    fetchCustomFunctions();
  }, []);

  // Custom Functions Modal
  const handleCustomFunctionsModal = () => {
    setShowFunctionsModal(true);
  };

  // Load custom functions into window object
  useEffect(() => {
    // Clear previous custom functions from window
    customFunctions.forEach((func) => {
      delete (window as any)[func.name];
    });

    // Add all custom functions to window
    customFunctions.forEach((func) => {
      try {
        // Create a function from the code string
        const funcToAdd = new Function(`return (${func.code})`)();
        (window as any)[func.name] = funcToAdd;
        console.log(`Custom function '${func.name}' loaded into window`);
      } catch (error) {
        console.error(`Error loading custom function '${func.name}':`, error);
      }
    });

    // Cleanup on unmount
    return () => {
      customFunctions.forEach((func) => {
        delete (window as any)[func.name];
      });
    };
  }, [customFunctions]);

  // Voice input recording functions
  const startVoiceRecording = async () => {
    if (isRecording || isProcessingVoice) return;
    
    setIsRecording(true);
    setIsProcessingVoice(false);
    setRecordingAnimation(true);
    setOrbState("active");
    
    try {
      // Check if browser supports Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false; // Stop after one utterance
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        let finalTranscript = '';
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          finalTranscript = transcript;
          console.log('Recognized:', transcript);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setRecordingAnimation(false);
          setOrbState("idle");
        };
        
        recognition.onend = async () => {
          setIsRecording(false);
          
          if (finalTranscript.trim()) {
            // Process the transcript
            await sendTranscriptToWebhook(finalTranscript);
          } else {
            setIsProcessingVoice(false);
            setOrbState("idle");
          }
        };
        
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        // Fallback - show error message
        console.error('Voice input not supported in this browser');
        setIsRecording(false);
        setRecordingAnimation(false);
        setOrbState("idle");
      }
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsRecording(false);
      setRecordingAnimation(false);
      setOrbState("idle");
    }
  };

  const sendTranscriptToWebhook = async (transcript: string) => {
    setIsProcessingVoice(true);
    setOrbState("processing");
    
    try {
      console.log('Sending transcript to webhook:', transcript);
      
      // Send POST request to webhook
      const response = await fetch('https://cst-n8n-pboxjbol.usecloudstation.com/webhook/367c716d-1649-4373-a1b5-c9cac073b947', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcript })
      });
      
      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      // Get the audio response as blob
      const audioBlob = await response.blob();
      
      // Create audio URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (responseAudioRef.current) {
        responseAudioRef.current.src = audioUrl;
        responseAudioRef.current.onloadeddata = () => {
          responseAudioRef.current?.play();
          setOrbState("active");
        };
        
        responseAudioRef.current.onplay = () => {
          setIsSpeaking(true);
        };
        
        responseAudioRef.current.onended = () => {
          setIsSpeaking(false);
          setOrbState("idle");
          setIsProcessingVoice(false);
          // Clean up the blob URL
          URL.revokeObjectURL(audioUrl);
        };
        
        responseAudioRef.current.onerror = (error) => {
          console.error('Error playing audio response:', error);
          setIsSpeaking(false);
          setOrbState("idle");
          setIsProcessingVoice(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      setIsProcessingVoice(false);
      setOrbState("idle");
    }
  };

  const handleVoiceInput = async (text: string) => {
    try {
      // Process the text
      const processedText = text.trim();
      
      if (processedText) {
        // Send to AI processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Process the response
        const aiResponse = await processVoiceResponse(processedText);
        
        // Update UI
        if (aiResponse) {
          // Add to messages
          const newMessage = {
            id: Date.now(),
            responseText: aiResponse,
            createdAt: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          // Speak the response
          speak(aiResponse);
          
          // Save to database
          saveResponse(aiResponse);
        }
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  };

  const processVoiceResponse = async (text: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Process the text
    const processedText = text.toLowerCase();
    
    // Simple processing - this would be replaced with actual AI processing
    if (processedText.includes('hello') || processedText.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (processedText.includes('how are you')) {
      return 'I am doing well, thank you for asking! How can I help you today?';
    } else if (processedText.includes('what is your name')) {
      return 'I am ARCEE, your AI assistant. How can I assist you today?';
    } else if (processedText.includes('weather')) {
      return 'I can check the weather for you. Would you like to know the current weather in Dakshin Dinajpur?';
    } else if (processedText.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (processedText.includes('date')) {
      return `Today is ${new Date().toLocaleDateString()}.`;
    } else if (processedText.includes('system stats')) {
      return `System stats: CPU ${systemStats.cpu}%, RAM ${systemStats.ram} GB, Memory ${systemStats.memory}%, Disk ${systemStats.disk}.`;
    } else if (processedText.includes('music')) {
      return 'I can play music for you. Would you like to know about the current music player?';
    } else if (processedText.includes('calculator')) {
      return 'I can perform calculations. What would you like to calculate?';
    } else if (processedText.includes('settings')) {
      return 'I can help you with settings. What specific settings would you like to adjust?';
    } else if (processedText.includes('photo')) {
      return 'I can help you with photo management. What would you like to do with your photos?';
    } else if (processedText.includes('theme')) {
      return 'I can help you with theme management. What theme would you like to adjust?';
    } else if (processedText.includes('custom function')) {
      return 'I can help you with custom functions. What specific function would you like to create or modify?';
    } else if (processedText.includes('help')) {
      return 'I can help you with various tasks. What would you like to know about?';
    } else if (processedText.includes('clear')) {
      return 'I can clear various things. What would you like to clear?';
    } else if (processedText.includes('exit')) {
      return 'Goodbye! Have a great day!';
    } else {
      return `I understand you said: "${text}". How can I assist you with that?`;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#000510] text-white">
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Hidden file input for music upload */}
      <input
        ref={musicInputRef}
        type="file"
        accept="audio/*"
        onChange={handleMusicUpload}
        className="hidden"
      />

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />

      {/* Hidden audio element for response playback */}
      <audio ref={responseAudioRef} className="hidden" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 229, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(0, 229, 255, 0.6) 0%, rgba(0, 229, 255, 0.3) 100%);
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(0, 229, 255, 0.8) 0%, rgba(0, 229, 255, 0.5) 100%);
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.8);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 229, 255, 0.6) rgba(0, 229, 255, 0.05);
        }

        @keyframes circularExpand {
          0% {
            clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
            opacity: 0;
          }
          100% {
            clip-path: circle(150% at var(--x, 50%) var(--y, 50%));
            opacity: 1;
          }
        }

        @keyframes circularCollapse {
          0% {
            clip-path: circle(150% at var(--x, 50%) var(--y, 50%));
            opacity: 1;
          }
          100% {
            clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
            opacity: 0;
          }
        }

        .drawer-expand {
          animation: circularExpand 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .drawer-collapse {
          animation: circularCollapse 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes iconRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .icon-animate {
          animation: iconRotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes soundwave {
          0%, 100% { 
            height: 10px;
            opacity: 0.3;
          }
          50% { 
            height: 40px;
            opacity: 1;
          }
        }

        /* Vinyl disc spin animation */
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Themes Management Modal */}
      {showThemesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative">
            {/* Saving Theme Loader Overlay */}
            {isSavingTheme && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Saving theme...</p>
              </div>
            )}

            {/* Clearing Main Loader Overlay */}
            {isClearingMain && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Clearing main theme...</p>
              </div>
            )}

            <button 
              onClick={() => {
                setShowThemesModal(false);
                setShowNewThemeForm(false);
                setNewThemeName("");
                setNewThemeCss("");
              }}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-cyan-400 text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Manage Themes
            </h3>
            
            {!showNewThemeForm ? (
              /* Theme List View */
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
                  {isLoadingThemes ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-cyan-400/60 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                        <p className="text-sm">Loading themes...</p>
                      </div>
                    </div>
                  ) : themes.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-cyan-400/40 space-y-2">
                        <Palette className="w-16 h-16 mx-auto" />
                        <p className="text-sm">No themes yet</p>
                        <p className="text-xs">Create your first custom theme</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          className="relative group"
                        >
                          <button
                            onClick={() => handleThemeSelect(theme)}
                            className={`w-full glass-panel p-4 text-left text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg ${
                              theme.isMain ? 'ring-2 ring-cyan-400/50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold flex items-center gap-2">
                                  {theme.name}
                                  {theme.isMain && (
                                    <span className="text-xs bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded">
                                      DEFAULT
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-cyan-400/60 mt-1">
                                  Click to apply theme
                                </div>
                              </div>
                              <Palette className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                            </div>
                          </button>
                          
                          {/* Delete button - Top Right */}
                          <button
                            onClick={(e) => handleDeleteTheme(theme.id, e)}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Delete theme"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleClearMain}
                    disabled={!themes.some(t => t.isMain)}
                    className="w-full glass-panel p-3 text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={themes.some(t => t.isMain) ? "Remove default theme and use system default" : "No theme is currently set as default"}
                  >
                    <EyeOff className="w-4 h-4" />
                    Set Default (No Theme)
                  </button>
                  
                  <button
                    onClick={() => setShowNewThemeForm(true)}
                    className="w-full glass-panel p-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Palette className="w-5 h-5" />
                    Create New Theme
                  </button>
                </div>
              </div>
            ) : (
              /* New Theme Form */
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
                  <div>
                    <label className="text-sm text-cyan-400/80 block mb-2">Theme Name</label>
                    <input
                      type="text"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      placeholder="Enter Theme Name"
                      className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <label className="text-sm text-cyan-400/80 block mb-2">CSS Code</label>
                    <textarea
                      value={newThemeCss}
                      onChange={(e) => setNewThemeCss(e.target.value)}
                      placeholder="Paste CSS code here"
                      rows={12}
                      className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400/50 font-mono text-sm resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewThemeForm(false);
                      setNewThemeName("");
                      setNewThemeCss("");
                    }}
                    className="flex-1 glass-panel p-3 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewTheme}
                    disabled={!newThemeName.trim() || !newThemeCss.trim()}
                    className="flex-1 glass-panel p-3 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Set and Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Options Modal */}
      {showPhotoOptions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="glass-panel rounded-lg p-6 w-80 relative">
            {/* Upload Loader Overlay */}
            {isUploadingPhoto && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Uploading...</p>
              </div>
            )}

            <button 
              onClick={() => setShowPhotoOptions(false)}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">Change Photo</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full glass-panel p-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg flex items-center gap-3"
              >
                <Upload className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Upload Photo</div>
                  <div className="text-xs text-cyan-400/60">Upload and set as main</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  fetchAllPhotos();
                  setShowPhotosGallery(true);
                }}
                className="w-full glass-panel p-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg flex items-center gap-3"
              >
                <Image className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Photos</div>
                  <div className="text-xs text-cyan-400/60">Select from existing photos</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowPhotoOptions(false);
                  setShowUrlInput(true);
                }}
                className="w-full glass-panel p-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div className="text-left">
                  <div className="font-semibold">URL</div>
                  <div className="text-xs text-cyan-400/60">Enter image URL (temporary)</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Input Dialog */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="glass-panel rounded-lg p-6 w-96 relative">
            {/* URL Loader Overlay */}
            {isSettingUrlPhoto && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Setting photo...</p>
              </div>
            )}

            <button 
              onClick={() => {
                setShowUrlInput(false);
                setTempPhotoUrl("");
              }}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">Enter Image URL</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-cyan-400/80 block mb-2">Image URL</label>
                <input
                  type="url"
                  value={tempPhotoUrl}
                  onChange={(e) => setTempPhotoUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUrlSubmit();
                    }
                  }}
                />
                <p className="text-xs text-cyan-400/50 mt-2">
                  This photo will be temporary and removed after page reload
                </p>
              </div>
              
              <button
                onClick={handleUrlSubmit}
                disabled={!tempPhotoUrl.trim()}
                className="w-full glass-panel p-3 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photos Gallery Modal */}
      {showPhotosGallery && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="glass-panel rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative">
           {/* Setting Main Photo Loader Overlay */}
            {isSettingMainPhoto && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Setting photo...</p>
              </div>
            )}
            {/* Deleting Photo Loader Overlay */}
            {isDeletingPhoto && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Deleting photo...</p>
              </div>
            )}

            <button 
              onClick={() => setShowPhotosGallery(false)}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">Select Photo</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoadingPhotos ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-cyan-400/60 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                    <p className="text-sm">Loading photos...</p>
                  </div>
                </div>
              ) : allPhotos.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-cyan-400/40 space-y-2">
                    <Image className="w-16 h-16 mx-auto" />
                    <p className="text-sm">No photos yet</p>
                    <p className="text-xs">Upload your first photo to get started</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {allPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => handleSetPhotoAsMain(photo.id, photo.photoUrl)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                        photo.isMain 
                          ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.5)]' 
                          : 'border-cyan-500/20 hover:border-cyan-400/50'
                      }`}
                    >
                      <img
                        src={photo.photoUrl}
                        alt="Arcee photo"
                        className="w-full h-full object-cover"
                      />
                      {/* Remove button - Top Left */}
                      <button
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                        className="absolute top-2 left-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      {/* Main badge - Top Right */}
                      {photo.isMain && (
                        <div className="absolute top-2 right-2 bg-cyan-400 text-black text-xs font-semibold px-2 py-1 rounded">
                          MAIN
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                        <span className="text-white text-xs">Click to set as main</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="glass-panel rounded-lg p-6 w-80 relative">
            <button 
              onClick={() => { setShowPasswordDialog(false); setPassword(""); }}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-cyan-400 text-lg font-semibold mb-4">Enter Password</h3>
            <div className="glass-panel rounded-lg p-4 mb-4 text-center">
              <div className="text-2xl font-mono text-cyan-400 tracking-widest min-h-[32px]">
                {password || "···"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  className="glass-panel p-4 text-cyan-400 font-semibold text-lg hover:bg-cyan-500/20 transition-colors rounded-lg"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="glass-panel p-4 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg"
              >
                C
              </button>
              <button
                onClick={() => handleNumberClick("0")}
                className="glass-panel p-4 text-cyan-400 font-semibold text-lg hover:bg-cyan-500/20 transition-colors rounded-lg"
              >
                0
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="glass-panel p-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Functions Modal */}
      {showFunctionsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative">
            {/* Saving Function Loader Overlay */}
            {isSavingFunction && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Saving function...</p>
              </div>
            )}

            {/* Deleting Function Loader Overlay */}
            {isDeletingFunction && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-cyan-400 text-sm font-semibold">Deleting function...</p>
              </div>
            )}

            <button 
              onClick={() => {
                setShowFunctionsModal(false);
                setShowNewFunctionForm(false);
                setEditingFunction(null);
                setNewFunctionName("");
                setNewFunctionCode("");
              }}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-cyan-400 text-lg font-semibold mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Custom Functions
            </h3>
            
            {!showNewFunctionForm && !editingFunction ? (
              /* Function List View */
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
                  {isLoadingFunctions ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-cyan-400/60 flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                        <p className="text-sm">Loading functions...</p>
                      </div>
                    </div>
                  ) : customFunctions.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-cyan-400/40 space-y-2">
                        <FileCode className="w-16 h-16 mx-auto" />
                        <p className="text-sm">No custom functions yet</p>
                        <p className="text-xs">Create your first custom function</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customFunctions.map((functionItem) => (
                        <div
                          key={functionItem.id}
                          className="relative group"
                        >
                          <button
                            onClick={() => {
                              // Open edit form with function data
                              setEditingFunction(functionItem);
                              setNewFunctionName(functionItem.name);
                              setNewFunctionCode(functionItem.code);
                            }}
                            className="w-full glass-panel p-4 text-left text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold flex items-center gap-2">
                                  {functionItem.name}
                                </div>
                                <div className="text-xs text-cyan-400/60 mt-1">
                                  Click to edit and save
                                </div>
                              </div>
                              <FileCode className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                            </div>
                          </button>
                          
                          {/* Delete button - Top Right */}
                          <button
                            onClick={(e) => handleDeleteCustomFunction(functionItem.id, e)}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Delete function"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setShowNewFunctionForm(true)}
                    className="w-full glass-panel p-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <FileCode className="w-5 h-5" />
                    Create New Function
                  </button>
                </div>
              </div>
            ) : (
              /* Edit/New Function Form */
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
                  <div>
                    <label className="text-sm text-cyan-400/80 block mb-2">Function Name</label>
                    <input
                      type="text"
                      value={newFunctionName}
                      onChange={(e) => setNewFunctionName(e.target.value)}
                      placeholder="Enter Function Name"
                      className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <label className="text-sm text-cyan-400/80 block mb-2">Function Code</label>
                    <textarea
                      value={newFunctionCode}
                      onChange={(e) => setNewFunctionCode(e.target.value)}
                      placeholder="Paste JavaScript code here"
                      rows={12}
                      className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400/50 font-mono text-sm resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewFunctionForm(false);
                      setEditingFunction(null);
                      setNewFunctionName("");
                      setNewFunctionCode("");
                    }}
                    className="flex-1 glass-panel p-3 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingFunction ? handleUpdateCustomFunction : handleAddCustomFunction}
                    disabled={!newFunctionName.trim() || !newFunctionCode.trim()}
                    className="flex-1 glass-panel p-3 text-cyan-400 hover:bg-cyan-500/20 transition-colors rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingFunction ? 'Save Changes' : 'Add Function'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animated Music Player - Bottom Left */}
      {(currentMusic || bgMusicData) && (
        <div className={`fixed bottom-6 left-6 z-50 flex flex-col items-center select-none transition-all duration-300 ease-linear ${
          (currentMusic || (bgMusicData && bgMusicData.isPlaying)) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } ${bgMusicData ? '' : 'group/player'}`}>
          {/* Vinyl Disc (visible when not hovering) */}
          <div className={`relative z-0 transition-all duration-200 ${
            bgMusicData 
              ? 'h-0' 
              : 'h-16 -mb-2 group-hover/player:h-0'
          }`}>
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              className={`duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 transition-all ${
                (bgMusicData?.isPlaying || isPlaying) ? 'animate-[vinyl-spin_3s_linear_infinite]' : ''
              }`}
            >
              <rect width="128" height="128" fill="black"></rect>
              <circle cx="20" cy="20" r="2" fill="white"></circle>
              <circle cx="40" cy="30" r="2" fill="white"></circle>
              <circle cx="60" cy="10" r="2" fill="white"></circle>
              <circle cx="80" cy="40" r="2" fill="white"></circle>
              <circle cx="100" cy="20" r="2" fill="white"></circle>
              <circle cx="120" cy="50" r="2" fill="white"></circle>
              <circle cx="90" cy="30" r="10" fill="white" fillOpacity="0.5"></circle>
              <circle cx="90" cy="30" r="8" fill="white"></circle>
              <path
                d="M0 128 Q32 64 64 128 T128 128"
                fill="purple"
                stroke="black"
                strokeWidth="1"
              ></path>
              <path
                d="M0 128 Q32 48 64 128 T128 128"
                fill="mediumpurple"
                stroke="black"
                strokeWidth="1"
              ></path>
              <path
                d="M0 128 Q32 32 64 128 T128 128"
                fill="rebeccapurple"
                stroke="black"
                strokeWidth="1"
              ></path>
              <path
                d="M0 128 Q16 64 32 128 T64 128"
                fill="purple"
                stroke="black"
                strokeWidth="1"
              ></path>
              <path
                d="M64 128 Q80 64 96 128 T128 128"
                fill="mediumpurple"
                stroke="black"
                strokeWidth="1"
              ></path>
            </svg>
            <div className="absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12"></div>
          </div>

          {/* Expandable Player Card */}
          <div className={`z-30 flex flex-col transition-all duration-300 bg-white shadow-md rounded-2xl shadow-zinc-400 ${
            bgMusicData 
              ? 'w-72 h-40' 
              : 'w-40 h-20 group-hover/player:h-40 group-hover/player:w-72'
          }`}>
            {/* Album Art and Track Info */}
            <div className={`flex flex-row w-full ${
              bgMusicData 
                ? 'h-20' 
                : 'h-0 group-hover/player:h-20'
            }`}>
              <div className={`relative flex items-center justify-center w-24 h-24 transition-all duration-100 ${
                bgMusicData 
                  ? `-top-6 -left-4 opacity-100 ${(bgMusicData?.isPlaying) ? 'animate-[vinyl-spin_3s_linear_infinite]' : ''}` 
                  : `opacity-0 group-hover/player:-top-6 group-hover/player:-left-4 group-hover/player:opacity-100 ${isPlaying ? 'group-hover/player:animate-[vinyl-spin_3s_linear_infinite]' : ''}`
              }`}>
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 128 128"
                  className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5"
                >
                  <rect width="128" height="128" fill="black"></rect>
                  <circle cx="20" cy="20" r="2" fill="white"></circle>
                  <circle cx="40" cy="30" r="2" fill="white"></circle>
                  <circle cx="60" cy="10" r="2" fill="white"></circle>
                  <circle cx="80" cy="40" r="2" fill="white"></circle>
                  <circle cx="100" cy="20" r="2" fill="white"></circle>
                  <circle cx="120" cy="50" r="2" fill="white"></circle>
                  <circle cx="90" cy="30" r="10" fill="white" fillOpacity="0.5"></circle>
                  <circle cx="90" cy="30" r="8" fill="white"></circle>
                  <path
                    d="M0 128 Q32 64 64 128 T128 128"
                    fill="purple"
                    stroke="black"
                    strokeWidth="1"
                  ></path>
                  <path
                    d="M0 128 Q32 48 64 128 T128 128"
                    fill="mediumpurple"
                    stroke="black"
                    strokeWidth="1"
                  ></path>
                  <path
                    d="M0 128 Q32 32 64 128 T128 128"
                    fill="rebeccapurple"
                    stroke="black"
                    strokeWidth="1"
                  ></path>
                  <path
                    d="M0 128 Q16 64 32 128 T64 128"
                    fill="purple"
                    stroke="black"
                    strokeWidth="1"
                  ></path>
                  <path
                    d="M64 128 Q80 64 96 128 T128 128"
                    fill="mediumpurple"
                    stroke="black"
                    strokeWidth="1"
                  ></path>
                </svg>
                <div className="absolute z-10 w-6 h-6 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-9 left-9"></div>
              </div>
              <div className={`flex flex-col justify-center w-full pl-3 overflow-hidden text-nowrap ${
                bgMusicData 
                  ? '-ml-3' 
                  : '-ml-24 group-hover/player:-ml-3'
              }`}>
                <p className="text-xl font-bold text-black truncate">
                  {bgMusicData ? bgMusicData.title : currentMusic?.name}
                </p>
                <p className="text-zinc-600 text-sm">
                  {bgMusicData ? bgMusicData.artist.split('\\n')[0] : 'Now Playing'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`flex flex-row mx-3 bg-indigo-100 rounded-md min-h-4 ${
              bgMusicData 
                ? 'mt-0' 
                : 'mt-3 group-hover/player:mt-0'
            }`}>
              <span className={`pl-3 text-sm text-zinc-600 ${
                bgMusicData 
                  ? 'inline-block' 
                  : 'hidden group-hover/player:inline-block'
              }`}>
                {bgMusicData ? bgMusicData.currentTime : formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={bgMusicData ? parseTimeToSeconds(bgMusicData.totalDuration) : (currentMusic?.duration || 0)}
                value={bgMusicData ? parseTimeToSeconds(bgMusicData.currentTime) : currentTime}
                onChange={bgMusicData ? undefined : seekMusic}
                disabled={!!bgMusicData}
                className={`flex-grow h-1 mx-2 my-auto bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md ${
                  bgMusicData 
                    ? 'w-full' 
                    : 'w-24 group-hover/player:w-full'
                }`}
              />
              <span className={`pr-3 text-sm text-zinc-600 ${
                bgMusicData 
                  ? 'inline-block' 
                  : 'hidden group-hover/player:inline-block'
              }`}>
                {bgMusicData ? bgMusicData.totalDuration : (currentMusic ? formatTime(currentMusic.duration) : '0:00')}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-row items-center justify-center flex-grow mx-3 space-x-5">
              {/* Shuffle/Repeat Toggle (placeholder) */}
              <div className={`flex items-center justify-center h-full cursor-pointer transition-all ${
                bgMusicData 
                  ? 'w-12 opacity-100' 
                  : 'w-0 opacity-0 group-hover/player:w-12 group-hover/player:opacity-100'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#777"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
              </div>

              {/* Skip Back (placeholder) */}
              <div className={`flex items-center justify-center w-12 h-full cursor-pointer transition-opacity ${
                bgMusicData 
                  ? 'opacity-100' 
                  : 'opacity-0 group-hover/player:opacity-100'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={bgMusicData ? undefined : (currentMusic ? () => playMusic(currentMusic) : undefined)}
                disabled={!!bgMusicData}
                className={`flex items-center justify-center w-12 h-full ${bgMusicData ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {(bgMusicData?.isPlaying || isPlaying) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              {/* Skip Forward (placeholder) */}
              <div className={`flex items-center justify-center w-12 h-full cursor-pointer transition-opacity ${
                bgMusicData 
                  ? 'opacity-100' 
                  : 'opacity-0 group-hover/player:opacity-100'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </div>

              {/* Playlist Button (placeholder) */}
              <div className={`flex items-center justify-center h-full cursor-pointer transition-all ${
                bgMusicData 
                  ? 'w-12 opacity-100' 
                  : 'w-12 opacity-0 group-hover/player:opacity-100'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#777"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between border-b border-cyan-500/20 bg-[#000510]/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-cyan-400">ARCEE</h1>
          <span className="flex items-center gap-2 text-xs text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-cyan-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            </svg>
            {clockTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            <span className="text-cyan-400/60">|</span>
            {clockTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>

          <div className="flex items-center gap-2 text-cyan-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            {temp ? `${temp.toFixed(1)}°C` : '--°C'}
            <span className="text-xs">Dakshin Dinajpur</span>
          </div>

          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-cyan-400" />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg overflow-hidden bg-[#000510]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,229,255,0.2)]">
                <div className="px-4 py-3 border-b border-cyan-500/30 bg-cyan-950/20">
                  <h3 className="text-cyan-400 font-semibold">Setting</h3>
                </div>
                <button
                  onClick={() => {
                    setShowSettingsDropdown(false);
                    setShowPhotoOptions(true);
                  }}
                  className="w-full px-4 py-3 text-left text-cyan-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-colors border-b border-cyan-500/20"
                >
                  Arcee's photo
                </button>
                <button
                  onClick={() => {
                    setShowSettingsDropdown(false);
                    setShowPasswordDialog(true);
                  }}
                  className="w-full px-4 py-3 text-left text-cyan-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-colors border-b border-cyan-500/20"
                >
                  Manage Arcee's knowledge
                </button>
                <button
                  onClick={() => {
                    setShowSettingsDropdown(false);
                    fetchThemes();
                    setShowThemesModal(true);
                  }}
                  className="w-full px-4 py-3 text-left text-cyan-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  Themes
                </button>
                <button
                  onClick={handleCustomFunctionsModal}
                  className="w-full px-4 py-3 text-left text-cyan-300 hover:text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  Custom Functions
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="absolute top-16 left-0 right-0 bottom-0 flex">
        {/* Left Sidebar/Toolbar */}
        <aside className={`${leftDrawerOpen ? 'w-[380px]' : 'w-[60px]'} border-r border-cyan-500/20 bg-[#000510]/50 backdrop-blur-sm transition-all duration-500 overflow-hidden relative`}>
          {/* Toolbar Icons (when closed) */}
          {!leftDrawerOpen && (
            <div className="flex flex-col items-center gap-4 py-6 px-2">
              <button
                onClick={() => handleLeftPanelClick('stats')}
                className="p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group relative"
                title="System Stats"
              >
                <Database className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleLeftPanelClick('weather')}
                className="p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
                title="Weather"
              >
                <Cloud className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleLeftPanelClick('calculator')}
                className="p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
                title="Calculator"
              >
                <Calculator className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleLeftPanelClick('uptime')}
                className="p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
                title="System Uptime"
              >
                <Clock className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Close Button (when open) */}
          {leftDrawerOpen && (
            <button
              onClick={() => {
                setLeftDrawerOpen(false);
                setLeftActivePanel(null);
              }}
              className="absolute top-4 right-2 z-10 p-2 hover:bg-cyan-500/20 rounded-full transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
            >
              <Minus className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
            </button>
          )}

          {/* Sidebar Content with Circular Animation */}
          {leftDrawerOpen && (
            <div 
              className="drawer-expand p-6 space-y-6 overflow-y-auto custom-scrollbar h-full pt-16"
              style={{
                '--x': '90%',
                '--y': leftActivePanel === 'stats' ? '10%' : 
                      leftActivePanel === 'weather' ? '25%' : 
                      leftActivePanel === 'calculator' ? '40%' : '55%'
              } as React.CSSProperties}
            >
              {/* System Stats */}
              {leftActivePanel === 'stats' && (
                <div className="glass-panel rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-cyan-400 text-sm font-semibold tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                      </svg>
                      System Stats
                    </h3>
                    <button className="text-cyan-400/60 hover:text-cyan-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-cyan-400/70">CPU Usage</span>
                        <span className="text-cyan-400 font-semibold">{systemStats.cpu}%</span>
                      </div>
                      <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: `${systemStats.cpu}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-cyan-400/70">RAM Usage</span>
                        <span className="text-cyan-400 font-semibold">{systemStats.ram} GB</span>
                      </div>
                      <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: '70%' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-cyan-500/20">
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">{systemStats.cpu}%</div>
                        <div className="text-xs text-cyan-400/60">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">{systemStats.memory}%</div>
                        <div className="text-xs text-cyan-400/60">Memory</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">{systemStats.disk}</div>
                        <div className="text-xs text-cyan-400/60">Disk</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather */}
              {leftActivePanel === 'weather' && (
                <div className="glass-panel rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-cyan-400 text-sm font-semibold tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      Weather
                    </h3>
                    <button 
                      onClick={handleRefreshWeather}
                      className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
                      title="Refresh weather data"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  {temp !== undefined ? (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-4xl font-bold text-cyan-400 mb-1">{temp.toFixed(1)}°C</div>
                          <div className="text-sm text-cyan-400/70 mb-1">Dakshin Dinajpur, IN</div>
                          <div className="text-xs text-cyan-400/60 capitalize">{description}</div>
                        </div>
                        <svg className="w-16 h-16 text-cyan-400/40" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                        </svg>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-cyan-500/20">
                        <div className="text-center">
                          <div className="text-xs text-cyan-400/60 mb-1">Humidity</div>
                          <div className="text-sm font-semibold text-cyan-400">{humidity}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-cyan-400/60 mb-1">Wind</div>
                          <div className="text-sm font-semibold text-cyan-400">{windSpeed?.toFixed(1)} m/s</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-cyan-400/60 mb-1">Feels Like</div>
                          <div className="text-sm font-semibold text-cyan-400">{weatherData?.main?.feels_like ? weatherData.main.feels_like.toFixed(1) : '--'}°C</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
                      <p className="text-cyan-400/60 text-sm">Loading weather...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Calculator */}
              {leftActivePanel === 'calculator' && (
                <div className="glass-panel rounded-lg p-2 sm:p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2">
                      <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                      Calculator
                    </h3>
                  </div>

                  {/* Display */}
                  <div className="glass-panel rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 text-right">
                    <div className="text-lg sm:text-2xl md:text-3xl font-mono text-cyan-400 tracking-wider min-h-[28px] sm:min-h-[36px] md:min-h-[44px] flex items-center justify-end break-all">
                      {calcDisplay}
                    </div>
                  </div>

                  {/* Calculator Buttons */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2">
                    <button
                      onClick={handleCalcClear}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg col-span-2"
                    >
                      C
                    </button>
                    <button
                      onClick={() => handleCalcOperation('/')}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                    >
                      ÷
                    </button>
                    <button
                      onClick={() => handleCalcOperation('*')}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                    >
                      ×
                    </button>

                    {[7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleCalcNumber(num.toString())}
                        className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => handleCalcOperation('-')}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                    >
                      −
                    </button>

                    {[4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleCalcNumber(num.toString())}
                        className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => handleCalcOperation('+')}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                    >
                      +
                    </button>

                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleCalcNumber(num.toString())}
                        className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={handleCalcEquals}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg row-span-2"
                    >
                      =
                    </button>

                    <button
                      onClick={() => handleCalcNumber('0')}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg col-span-2"
                    >
                      0
                    </button>
                    <button
                      onClick={handleCalcDecimal}
                      className="glass-panel p-2 sm:p-3 md:p-4 text-cyan-400 text-sm sm:text-base md:text-lg font-semibold hover:bg-cyan-500/20 transition-colors rounded-lg"
                    >
                      .
                    </button>
                  </div>
                </div>
              )}

              {/* System Uptime */}
              {leftActivePanel === 'uptime' && (
                <div className="glass-panel rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-cyan-400 text-sm font-semibold tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      System Uptime
                    </h3>
                    <span className="text-cyan-400 font-mono text-sm">00:00:28</span>
                    <button className="text-cyan-400/60 hover:text-cyan-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Center */}
        <main className="flex-1 flex flex-col items-center justify-center relative">
          {/* Central Orb with AI Face */}
          <div className="relative">
            <canvas ref={canvasRef} className="w-[400px] h-[400px]" />
            {/* AI Girl Face - Now Clickable */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
            >
              <div 
                ref={photoContainerRef}
                onMouseDown={handlePhotoMouseDown}
                onTouchStart={handlePhotoTouchStart}
                className="relative w-48 h-48 rounded-full overflow-hidden transition-transform" 
                style={{
                  '--tw-scale-x': '100%',
                  '--tw-scale-y': '100%',
                  '--tw-scale-z': '100%',
                  transform: 'scale(1)',
                  cursor: isDraggingPhoto ? 'grabbing' : 'grab'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!isDraggingPhoto) {
                    e.currentTarget.style.setProperty('--tw-scale-x', '105%');
                    e.currentTarget.style.setProperty('--tw-scale-y', '105%');
                    e.currentTarget.style.setProperty('--tw-scale-z', '105%');
                    e.currentTarget.style.transform = 'scale(var(--tw-scale-x)) scale(var(--tw-scale-y))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDraggingPhoto) {
                    e.currentTarget.style.setProperty('--tw-scale-x', '100%');
                    e.currentTarget.style.setProperty('--tw-scale-y', '100%');
                    e.currentTarget.style.setProperty('--tw-scale-z', '100%');
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}>
                {/* Holographic glow effect */}
                <div className={`absolute inset-0 z-0 rounded-full ${
                  orbState === 'processing' ? 'animate-pulse' : ''
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-violet-500/20 to-cyan-400/30 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/20 via-transparent to-violet-500/20" />
                </div>
                
                {/* Loading State */}
                {isLoadingMainPhoto ? (
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      {/* Only 2 outer circles visible */}
                      <div className="relative w-24 h-24">
                        {/* Circle 4 (outer) */}
                        <div className="absolute inset-0">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-3 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" style={{ animationDuration: '1.6s', width: '4.5rem', height: '4.5rem' }} />
                        </div>
                        {/* Circle 5 (outermost) */}
                        <div className="absolute inset-0">
                          <div className="w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" style={{ animationDuration: '1.8s' }} />
                        </div>
                      </div>
                      <p className="text-cyan-400 text-xs font-semibold">Loading...</p>
                    </div>
                  </div>
                ) : (
                  /* AI Face Image */
                  <img 
                    src={arceePhoto}
                    alt="AI Assistant"
                    className={`relative z-20 w-full h-full object-cover transition-all duration-500 ${
                      isDraggingPhoto ? 'brightness-125' :
                      orbState === 'processing' ? 'scale-105 brightness-125' : 
                      orbState === 'active' ? 'scale-102 brightness-110' : 'brightness-100'
                    }`}
                    style={{
                      objectPosition: `${photoPosition.x}% ${photoPosition.y}%`,
                      mixBlendMode: 'screen',
                      filter: `
                        drop-shadow(0 0 20px rgba(0, 229, 255, ${orbState === 'processing' ? '0.8' : orbState === 'active' ? '0.5' : '0.3'}))
                        drop-shadow(0 0 40px rgba(179, 0, 255, ${orbState === 'processing' ? '0.6' : orbState === 'active' ? '0.3' : '0.2'}))
                        hue-rotate(${orbState === 'processing' ? '10deg' : '0deg'})
                      `
                    }}
                  />
                )}
                
                {/* Holographic scan lines */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse" 
                       style={{ 
                         backgroundSize: '100% 200%',
                         animation: 'scan 3s linear infinite'
                       }} />
                </div>
                
                {/* Outer glow ring */}
                <div className={`absolute -inset-2 rounded-full border-2 ${
                  isDraggingPhoto ? 'border-cyan-400/80 shadow-[0_0_40px_rgba(0,229,255,0.8)]' :
                  orbState === 'processing' ? 'border-cyan-400/60 shadow-[0_0_30px_rgba(0,229,255,0.6)]' : 
                  orbState === 'active' ? 'border-cyan-400/40 shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 
                  'border-cyan-400/20 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                } transition-all duration-300`} />
              </div>
            </div>
            
            {/* Energy particles */}
            {orbState === 'processing' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-cyan-400"
                    style={{
                      animation: `particle ${2 + i * 0.3}s ease-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                      transform: `rotate(${i * 60}deg) translateY(-100px)`,
                      opacity: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <style>{`
            @keyframes scan {
              0%, 100% { transform: translateY(-100%); }
              50% { transform: translateY(100%); }
            }
            
            @keyframes particle {
              0% { 
                transform: rotate(var(--rotation, 0deg)) translateY(0); 
                opacity: 0; 
              }
              50% { 
                opacity: 1; 
              }
              100% { 
                transform: rotate(var(--rotation, 0deg)) translateY(-150px); 
                opacity: 0; 
              }
            }
          `}</style>

          {/* Branding */}
          <div className="mt-8 text-center">
            {isSpeaking ? (
              /* Speaking Animation */
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full"
                      style={{
                        height: '40px',
                        animation: `soundwave 0.6s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <p className="text-cyan-400 text-sm font-semibold tracking-wider animate-pulse">
                  Speaking...
                </p>
              </div>
            ) : (
              /* Normal Branding */
              <>
                <h2 className="text-4xl font-bold tracking-[0.3em] text-cyan-400 mb-3">ARCEE</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-cyan-400/80">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Voice mode active
                </div>
              </>
            )}
          </div>
        </main>

        {/* Right Sidebar/Toolbar */}
        <aside className={`${rightDrawerOpen ? 'w-[400px]' : 'w-[60px]'} border-l border-cyan-500/20 bg-[#000510]/50 backdrop-blur-sm transition-all duration-500 flex flex-col overflow-hidden relative`}>
          {/* Toolbar Icons (when closed) */}
          {!rightDrawerOpen && (
            <div className="flex flex-col items-center gap-4 py-6 px-2">
              <button
                onClick={() => handleRightPanelClick('messages')}
                className="p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
                title="AI Responses"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleRightPanelClick('music')}
                className="p-3 hover:bg-cyan-500/20 rounded-lg transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
                title="Music Player"
              >
                <Music className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Close Button (when open) */}
          {rightDrawerOpen && (
            <button
              onClick={() => {
                setRightDrawerOpen(false);
                setRightActivePanel('messages');
              }}
              className="absolute top-2 left-2 z-10 p-1 hover:bg-cyan-500/20 rounded-full transition-all duration-300 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] group"
            >
              <Minus className="w-4 h-4 transition-transform duration-500 group-hover:scale-110" />
            </button>
          )}

          {/* Content with Circular Animation */}
          {rightDrawerOpen && (
            <div 
              className="drawer-expand flex flex-col h-full"
              style={{
                '--x': '10%',
                '--y': rightActivePanel === 'messages' ? '10%' : '30%'
              } as React.CSSProperties}
            >
              {/* Messages Panel */}
              {rightActivePanel === 'messages' && (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-cyan-500/20 pt-12">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cyan-400 text-lg font-semibold tracking-wider">AI Responses</h3>
                      <div className="flex items-center gap-2">
                        {/* Calendar Icon */}
                        <div className="relative" ref={calendarRef}>
                          <button 
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={`p-2 hover:bg-cyan-500/10 rounded-lg transition-colors ${selectedDate ? 'text-cyan-400' : 'text-cyan-400/60'} hover:text-cyan-400`}
                            title="Filter by date"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>

                          {/* Calendar Dropdown */}
                          {showCalendar && (
                            <div className="absolute right-0 top-full mt-2 z-20 glass-panel rounded-lg p-3 w-64">
                              <div className="space-y-2">
                                <label className="text-xs text-cyan-400/80 block">Select Date</label>
                                <input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e) => handleDateSelect(e.target.value)}
                                  max={new Date().toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm focus:outline-none focus:border-cyan-400/50"
                                />
                                {selectedDate && (
                                  <button
                                    onClick={handleClearDateFilter}
                                    className="w-full px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 text-xs transition-colors"
                                  >
                                    Show Today's Responses
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={extractConversation}
                          className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors text-cyan-400/60 hover:text-cyan-400"
                          title="Extract Conversation"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Date Filter Indicator */}
                    {selectedDate && (
                      <div className="text-xs text-cyan-400/70 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Showing responses from {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {isLoadingResponses ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-cyan-400/60 flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                          <p className="text-sm">Loading responses...</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-cyan-400/40 space-y-2">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <p className="text-sm">
                            {selectedDate ? 'No responses for this date' : 'Listening...'}
                          </p>
                          <p className="text-xs">
                            {selectedDate ? 'Try selecting a different date' : 'Speak to ARCEE through your extension'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="flex flex-col items-start">
                          <div className="max-w-[95%] rounded-lg p-4 bg-cyan-950/30 border border-cyan-500/20">
                            <p className="text-sm text-cyan-100 leading-relaxed">{message.responseText}</p>
                          </div>
                          <span className="text-xs text-cyan-400/50 mt-1">
                            {new Date(message.createdAt).toLocaleString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* Music Panel */}
              {rightActivePanel === 'music' && (
                <>
                  {/* Music Header */}
                  <div className="p-4 border-b border-cyan-500/20 pt-12">
                    <div className="flex items-center justify-between">
                      <h3 className="text-cyan-400 text-lg font-semibold tracking-wider flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Music Player
                      </h3>
                      <button
                        onClick={() => musicInputRef.current?.click()}
                        className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors text-cyan-400/60 hover:text-cyan-400"
                        title="Upload Music"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Music List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {musicFiles.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-cyan-400/40 space-y-2">
                          <Music className="w-16 h-16 mx-auto" />
                          <p className="text-sm">No music files yet</p>
                          <p className="text-xs">Upload your first music file to get started</p>
                          <button
                            onClick={() => musicInputRef.current?.click()}
                            className="mt-4 px-4 py-2 glass-panel rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
                          >
                            Upload Music
                          </button>
                        </div>
                      </div>
                    ) : (
                      musicFiles.map((music) => (
                        <div
                          key={music.id}
                          className={`relative glass-panel p-3 rounded-lg cursor-pointer transition-all group ${
                            currentMusic?.id === music.id 
                              ? 'ring-2 ring-cyan-400/50 bg-cyan-500/10' 
                              : 'hover:bg-cyan-500/10'
                          }`}
                          onClick={() => playMusic(music)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              currentMusic?.id === music.id && isPlaying
                                ? 'bg-cyan-400 text-black'
                                : 'bg-cyan-500/20 text-cyan-400'
                            }`}>
                              {currentMusic?.id === music.id && isPlaying ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5 ml-0.5" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-cyan-400 font-semibold truncate">
                                {music.name}
                              </p>
                              <p className="text-xs text-cyan-400/60">
                                {formatTime(music.duration)}
                              </p>
                            </div>

                            <button
                              onClick={(e) => deleteMusic(music.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded transition-all text-red-400"
                              title="Delete music"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Progress bar for current playing music */}
                          {currentMusic?.id === music.id && (
                            <div className="mt-3">
                              <input
                                type="range"
                                min="0"
                                max={music.duration || 0}
                                value={currentTime}
                                onChange={seekMusic}
                                className="w-full h-1 bg-cyan-500/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                              />
                              <div className="flex justify-between text-xs text-cyan-400/60 mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(music.duration)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Mini Music Player (when music is playing) */}
                  {currentMusic && (
                    <div className="p-4 border-t border-cyan-500/20 bg-[#000510]/80">
                      <div className="glass-panel p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 flex items-center justify-center">
                            <Music className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-cyan-400 font-semibold truncate">
                              {currentMusic.name}
                            </p>
                            <p className="text-xs text-cyan-400/60">
                              Now Playing
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max={currentMusic.duration || 0}
                            value={currentTime}
                            onChange={seekMusic}
                            className="w-full h-2 bg-cyan-500/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                          />
                          <div className="flex justify-between text-xs text-cyan-400/60">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(currentMusic.duration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-4">
                          <button
                            onClick={() => playMusic(currentMusic)}
                            className="w-12 h-12 rounded-full bg-cyan-400 hover:bg-cyan-500 text-black flex items-center justify-center transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6" />
                            ) : (
                              <Play className="w-6 h-6 ml-0.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}