import React, { useState, useEffect } from 'react';
import { getMusic, addMusic, deleteMusic } from '../../utils/api';
import { Music, Trash2, Upload } from 'lucide-react';

const MusicManager = () => {
  const [songs, setSongs] = useState([]);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMusic = async () => setSongs(await getMusic());
  useEffect(() => { fetchMusic(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !file) return alert("Please provide a name and select an MP3 file.");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('audio', file); // Field name must match backend 'audio'

    try {
        await addMusic(formData);
        setName('');
        setFile(null);
        fetchMusic();
    } catch (error) {
        alert("Upload failed.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this song?")) {
        await deleteMusic(id);
        fetchMusic();
    }
  };

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-black text-white mb-8">BACKGROUND MUSIC</h1>

      {/* UPLOAD FORM */}
      <div className="bg-[#111] p-6 rounded-2xl border border-white/10 mb-8 max-w-xl">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Upload size={18}/> Upload New Song</h3>
          <form onSubmit={handleUpload} className="space-y-4">
              <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Song Title (e.g. Chill Vibes 1)" 
                  className="w-full bg-black border border-white/20 text-white p-3 rounded-lg outline-none focus:border-[#39FF14]"
              />
              <input 
                  type="file" 
                  accept="audio/mp3,audio/wav"
                  onChange={e => setFile(e.target.files[0])} 
                  className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#39FF14]/20 file:text-[#39FF14]"
              />
              <button disabled={loading} type="submit" className="w-full bg-[#39FF14] text-black font-black py-3 rounded-xl hover:bg-white transition-colors">
                  {loading ? 'UPLOADING...' : 'UPLOAD SONG'}
              </button>
          </form>
      </div>

      {/* SONG LIST */}
      <div className="space-y-3 max-w-xl">
          {songs.map(song => (
              <div key={song.id} className="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-white">
                      <div className="bg-white/5 p-2 rounded-lg text-[#39FF14]"><Music size={20}/></div>
                      <span className="font-bold">{song.name}</span>
                  </div>
                  <button onClick={() => handleDelete(song.id)} className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                      <Trash2 size={18}/>
                  </button>
              </div>
          ))}
          {songs.length === 0 && <p className="text-gray-500 text-sm">No songs uploaded yet.</p>}
      </div>
    </div>
  );
};

export default MusicManager;