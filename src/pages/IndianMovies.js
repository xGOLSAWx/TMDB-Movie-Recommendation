import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './IndianMovies.css';

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' },
  { id: 27, name: 'Horror' },
  { id: 53, name: 'Thriller' },
];

const IndianMovies = () => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  const navigate = useNavigate();
  const [genreMovies, setGenreMovies] = useState({});

  useEffect(() => {
    genres.forEach((genre) => {
      fetchMoviesByGenre(genre.id);
    });
  }, []);

  const fetchMoviesByGenre = async (genreId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&region=IN&with_original_language=hi&with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
      );
      setGenreMovies((prev) => ({
        ...prev,
        [genreId]: response.data.results.slice(0, 12),
      }));
    } catch (error) {
      console.error('Error fetching movies for genre:', genreId, error);
    }
  };

  return (
    <div className="indian-movies-container-hotstar">
      {genres.map((genre) => (
        <div key={genre.id} className="genre-section">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h2 className="hotstar-title">{genre.name} Movies</h2>
            <button
              className="see-all-btn"
              onClick={() =>
                navigate(
                  `/genre/${genre.id}/${genre.name}?region=IN`
                )
              }
              aria-label={`See all ${genre.name} movies`}
              style={{
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                color: '#1f80e0',
                fontWeight: '600',
                fontSize: '1rem',
              }}
            >
              See All &gt;
            </button>
          </div>
          <div className="movies-carousel">
            {genreMovies[genre.id]?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} navigate={navigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MovieCard = ({ movie, navigate }) => {
  const [trailerKey, setTrailerKey] = React.useState(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const fetchTrailer = async () => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`
      );
      const trailers = res.data.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailers.length > 0) {
        setTrailerKey(trailers[0].key);
      }
    } catch (err) {
      console.error('Failed to fetch trailer:', err);
    }
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/fallback-poster.jpg';

  return (
    <div
      className="movie-card-hotstar"
      onMouseEnter={() => {
        setIsHovered(true);
        if (!trailerKey) fetchTrailer();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/movie/${movie.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/movie/${movie.id}`);
      }}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="video-wrapper">
        {isHovered && trailerKey ? (
          <iframe
            className="trailer-iframe"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&loop=1&playlist=${trailerKey}`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <img
            src={posterUrl}
            alt={movie.title || 'No Title'}
            className="movie-poster-hotstar"
          />
        )}
      </div>

      <div className="movie-info-hotstar">
        <h3 className="movie-title-hotstar">{movie.title}</h3>
        <div className="movie-rating-hotstar">
          <FaStar className="star-icon-hotstar" /> {movie.vote_average?.toFixed(1) || 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default IndianMovies;
