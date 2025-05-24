// src/pages/Genres.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GenreAnimations.css';
import './GlitchEffect.css';
import Lottie from 'lottie-react';
import horrorIcon from '../assets/icons/horror.json';
import actionIcon from '../assets/icons/action.json';
import comedyIcon from '../assets/icons/comedy.json';
import fantasyIcon from '../assets/icons/fantasy.json';
import scifiIcon from '../assets/icons/scifi.json';
import dramaIcon from '../assets/icons/drama.json';
import romanceIcon from '../assets/icons/romance.json';
import thrillerIcon from '../assets/icons/thriller.json';
import horrorSound from '../assets/sounds/horror.mp3';
import actionSound from '../assets/sounds/action.mp3';
import comedySound from '../assets/sounds/comedy.mp3';
import fantasySound from '../assets/sounds/fantasy.mp3';
import scifiSound from '../assets/sounds/scifi.mp3';
import dramaSound from '../assets/sounds/drama.mp3';
import romanceSound from '../assets/sounds/romance.mp3';
import thrillerSound from '../assets/sounds/thriller.mp3';

const genreEffects = {
  Horror: { className: 'horror-transition', sound: horrorSound, icon: horrorIcon },
  Action: { className: 'action-transition', sound: actionSound, icon: actionIcon },
  Comedy: { className: 'comedy-transition', sound: comedySound, icon: comedyIcon },
  Fantasy: { className: 'fantasy-transition', sound: fantasySound, icon: fantasyIcon },
  'Science Fiction': { className: 'scifi-transition', sound: scifiSound, icon: scifiIcon },
  Drama: { className: 'drama-transition', sound: dramaSound, icon: dramaIcon },
  Romance: { className: 'romance-transition', sound: romanceSound, icon: romanceIcon },
  Thriller: { className: 'thriller-transition', sound: thrillerSound, icon: thrillerIcon },
};

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [activeEffect, setActiveEffect] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
      );
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  const handleGenreClick = (id, name) => {
    const effect = genreEffects[name] || { className: 'default-transition' };
    setActiveEffect(effect.className);

    if (effect.sound) {
      const audio = new Audio(effect.sound);
      audio.play();
    }

    setTimeout(() => {
      navigate(`/genre/${id}/${encodeURIComponent(name)}`);
    }, 1500);
  };

  return (
    <div className={`genre-container ${activeEffect}`}>
      <h1 className="text-4xl text-white font-bold mb-6 text-center border-4 border-yellow-400 p-4 relative glitch-title">
        <span aria-hidden="true">Select Genre</span>
        Select Genre
        <span aria-hidden="true">Select Genre</span>
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        {genres.map((genre) => {
          const config = genreEffects[genre.name] || {};
          return (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.id, genre.name)}
              className="genre-button relative flex flex-col items-center justify-center"
            >
              {config.icon && (
                <Lottie animationData={config.icon} className="w-16 h-16 mb-1" loop={true} />
              )}
              <span>{genre.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Genres;
