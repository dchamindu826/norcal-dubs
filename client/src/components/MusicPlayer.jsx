import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Volume2, X, ListMusic } from 'lucide-react';
import { getMusic } from '../utils/api';

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const audioRef = useRef(new Audio());

  // Component එක අයින් වෙද්දි (unmount) background සද්දෙත් නවත්තලා දානවා (Double Play Fix)
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  // 1. Database එකෙන් සින්දු ටික ගන්නවා
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getMusic();
        setSongs(data);
        if (data.length > 0) {
          setCurrentSong(data[0]); 
        }
      } catch (error) {
        console.error("Failed to fetch music:", error);
      }
    };
    fetchSongs();
  }, []);

  // 2. සින්දුවක් ඉවර උනාම ඊළඟ එක play වෙන්න හදනවා
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
      if (currentIndex !== -1 && currentIndex + 1 < songs.length) {
        setCurrentSong(songs[currentIndex + 1]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false); 
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, songs]);

  // 3. Current Song එක මාරු වෙද්දි Audio Source එක update කරනවා
  useEffect(() => {
    if (currentSong) {
      const fileName = currentSong.fileName || currentSong.file;
      audioRef.current.src = `https://norcalbudz.com/uploads/${fileName}`;
      
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log("Browser auto-play blocked it.", e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  // 4. Play/Pause state එක මාරු වෙද්දි සින්දුව පාලනය කරනවා
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.log("Play prevented by browser:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (songs.length === 0) return null; 

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#111] border border-[#39FF14]/50 text-[#39FF14] p-3 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-110 transition-transform flex items-center gap-3 group animate-bounce-slow"
        >
          <div className="relative">
            {isPlaying ? <Volume2 size={24} /> : <Music size={24} />}
            {isPlaying && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[#39FF14]"></span></span>}
          </div>
          <span className="hidden md:inline text-xs font-bold uppercase tracking-widest truncate max-w-[120px] text-white">
              {currentSong ? currentSong.name : "Play Music"}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0a0a0a] border border-[#39FF14]/30 w-72 rounded-2xl p-5 shadow-2xl animate-fade-in relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={18}/></button>
          
          <div className="flex items-center gap-2 mb-4 text-[#39FF14]">
              <ListMusic size={20} />
              <h4 className="text-white text-sm font-black uppercase tracking-widest">Select Vibe</h4>
          </div>

          <div className="space-y-2 mb-6 max-h-32 overflow-y-auto scrollbar-hide border-b border-white/10 pb-4">
              {songs.map((song, index) => (
                  <div 
                      key={song.id || index} 
                      onClick={() => { 
                          setCurrentSong(song); 
                          setIsPlaying(true); 
                      }}
                      className={`text-xs p-3 rounded-lg cursor-pointer transition-colors font-bold ${currentSong?.id === song.id ? 'bg-[#39FF14] text-black shadow-md' : 'bg-[#111] text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                      {song.name}
                  </div>
              ))}
          </div>

          <div className="flex items-center justify-between">
              <div className="text-[#39FF14] text-xs font-bold truncate max-w-[140px] animate-pulse">
                  {isPlaying ? 'Playing: ' + currentSong?.name : 'Paused'}
              </div>
              <button onClick={togglePlay} className="bg-[#39FF14] text-black p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                  {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;