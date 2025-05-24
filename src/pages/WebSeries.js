// src/pages/WebSeries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './IndianMovies.css'; // your existing styles


const WebSeries = () => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);               // ← dynamic genres
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [scope, setScope] = useState('IN');               // 'IN' or 'GLOBAL'

  // 1️⃣ Fetch all TV genres once
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/tv/list`,
          { params: { api_key: apiKey, language: 'en-US' } }
        );
        setGenres(res.data.genres);
      } catch (err) {
        console.error('Error fetching TV genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // 2️⃣ Whenever genres or scope changes, fetch series for each genre
  useEffect(() => {
    if (!genres.length) return;

    genres.forEach((genre) => {
      fetchSeriesByGenre(genre.id);
    });
  }, [genres, scope]);

  const fetchSeriesByGenre = async (genreId) => {
    try {
      const regionParam =
        scope === 'IN' ? '&region=IN&with_original_language=hi' : '';
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/tv`,
        {
          params: {
            api_key: apiKey,
            language: 'en-US',
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page: 1,
            ...(scope === 'IN' && { region: 'IN', with_original_language: 'hi' })
          }
        }
      );
      setSeriesByGenre((prev) => ({
        ...prev,
        [genreId]: res.data.results.slice(0, 12),
      }));
    } catch (err) {
      console.error('Error fetching series for genre', genreId, err);
    }
  };

  return (
    <div className="indian-movies-container-hotstar">
      {/* Scope Selector */}
      <div className="flex justify-center gap-4 mb-6">
        {['IN', 'GLOBAL'].map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`px-4 py-2 rounded ${
              scope === s ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'
            }`}
          >
            {s === 'IN' ? 'Indian Series' : 'Global Series'}
          </button>
        ))}
      </div>

      {/* Dynamic Genre Sections */}
      {genres.map((genre) => (
        <div key={genre.id} className="genre-section">
          <div className="flex justify-between items-center mb-2">
            <h2 className="hotstar-title">{genre.name}</h2>
            <button
              className="see-all-btn"
              onClick={() =>
                navigate(
                  `/genre/${genre.id}/${genre.name}?type=tv&region=${scope}`
                )
              }
            >
              See All &gt;
            </button>
          </div>
          <div className="movies-carousel">
            {seriesByGenre[genre.id]?.map((show) => (
              <SeriesCard
                key={show.id}
                show={show}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SeriesCard = ({ show, navigate }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [hovered, setHovered] = useState(false);

  const fetchTrailer = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/tv/${show.id}/videos`,
        { params: { api_key: process.env.REACT_APP_TMDB_API_KEY } }
      );
      const tr = res.data.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      );
      if (tr) setTrailerKey(tr.key);
    } catch (e) {
      console.error('Trailer fetch fail', e);
    }
  };

  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : '/fallback-poster.jpg';

  return (
    <div
      className="movie-card-hotstar"
      onMouseEnter={() => {
        setHovered(true);
        if (!trailerKey) fetchTrailer();
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/tv/${show.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/tv/${show.id}`)}
      aria-label={`View details for ${show.name}`}
    >
      <div className="video-wrapper">
        {hovered && trailerKey ? (
          <iframe
            className="trailer-iframe"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&loop=1&playlist=${trailerKey}`}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <img
            src={poster}
            alt={show.name}
            className="movie-poster-hotstar"
          />
        )}
      </div>
      <div className="movie-info-hotstar">
        <h3 className="movie-title-hotstar">{show.name}</h3>
        <div className="movie-rating-hotstar">
          <FaStar className="star-icon-hotstar" />{' '}
          {show.vote_average?.toFixed(1) || 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default WebSeries;
