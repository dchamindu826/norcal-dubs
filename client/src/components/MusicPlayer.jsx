import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Volume2, X } from 'lucide-react';
import { getMusic } from '../utils/api';

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await getMusic();
      setSongs(data);
      if (data.length > 0) setCurrentSong(data[0]);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (currentSong) {
      // Setup audio URL (Adjust domain as needed)
      audioRef.current.src = `https://norcalbudz.com/uploads/${currentSong.fileName}`;
      if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Auto-play prevented", e));
      }
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (songs.length === 0) return null; // සින්දු නැත්නම් පෙන්නන්නේ නෑ

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      {/* Mini Player Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#111] border border-[#39FF14]/30 text-white p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:scale-110 transition-transform flex items-center gap-3 group"
        >
          <div className={`relative ${isPlaying ? 'text-[#39FF14]' : 'text-white'}`}>
            <Music size={24} />
            {isPlaying && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[#39FF14]"></span></span>}
          </div>
          <span className="hidden md:inline text-xs font-bold uppercase tracking-widest overflow-hidden whitespace-nowrap max-w-[100px] truncate text-gray-400 group-hover:text-white">
              {currentSong?.name || "Music"}
          </span>
        </button>
      )}

      {/* Expanded Player */}
      {isOpen && (
        <div className="bg-[#0a0a0a] border border-[#39FF14]/30 w-64 rounded-2xl p-4 shadow-2xl animate-fade-in relative">
          <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={16}/></button>
          
          <div className="flex items-center gap-2 mb-4">
              <Volume2 size={16} className="text-[#39FF14]"/>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Background Music</h4>
          </div>

          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto scrollbar-hide">
              {songs.map(song => (
                  <div 
                      key={song.id} 
                      onClick={() => { setCurrentSong(song); setIsPlaying(true); }}
                      className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${currentSong?.id === song.id ? 'bg-[#39FF14]/20 text-[#39FF14] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                      {song.name}
                  </div>
              ))}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="text-[#39FF14] text-xs font-bold truncate max-w-[120px]">
                  {currentSong?.name}
              </div>
              <button onClick={togglePlay} className="bg-[#39FF14] text-black p-2 rounded-full hover:bg-white transition-colors">
                  {isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;