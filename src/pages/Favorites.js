// src/pages/Favorites.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from '../auth/authUtils';
import {
  getUserFavorites,
  getUserFavoriteActors,
  getUserFavoriteTV, // ✅ Ensure this function exists in favoriteUtils.js
} from '../auth/favoriteUtils';

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('movies');
  const [movieDetails, setMovieDetails] = useState([]);
  const [actorDetails, setActorDetails] = useState([]);
  const [tvDetails, setTvDetails] = useState([]); // ✅ State for TV series

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = getCurrentUser();
      if (!user || !user.email) return;

      const apiKey = process.env.REACT_APP_TMDB_API_KEY;

      // Fetch movie favorites
      const movieIds = await getUserFavorites(user.email);
      if (movieIds.length) {
        Promise.all(
          movieIds.map(id =>
            axios
              .get(`https://api.themoviedb.org/3/movie/${id}`, {
                params: { api_key: apiKey },
              })
              .then(res => res.data)
              .catch(() => null)
          )
        ).then(data => setMovieDetails(data.filter(Boolean)));
      }

      // Fetch actor favorites
      const actorIds = await getUserFavoriteActors(user.email);
      if (actorIds.length) {
        Promise.all(
          actorIds.map(id =>
            axios
              .get(`https://api.themoviedb.org/3/person/${id}`, {
                params: { api_key: apiKey },
              })
              .then(res => res.data)
              .catch(() => null)
          )
        ).then(data => setActorDetails(data.filter(Boolean)));
      }

      // ✅ Fetch TV series favorites
      const tvIds = await getUserFavoriteTV(user.email);
      if (tvIds.length) {
        Promise.all(
          tvIds.map(id =>
            axios
              .get(`https://api.themoviedb.org/3/tv/${id}`, {
                params: { api_key: apiKey },
              })
              .then(res => res.data)
              .catch(() => null)
          )
        ).then(data => setTvDetails(data.filter(Boolean)));
      }
    };

    fetchFavorites();
  }, []);

  const tabClasses = isActive =>
    `px-4 py-2 rounded-t-lg focus:outline-none ${
      isActive
        ? 'bg-yellow-500 text-black'
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">Your Favorites</h1>

      {/* Tabs */}
      <div role="tablist" aria-label="Favorite Categories" className="flex gap-2">
        <button
          role="tab"
          aria-selected={activeTab === 'movies'}
          onClick={() => setActiveTab('movies')}
          className={tabClasses(activeTab === 'movies')}
        >
          Favorite Movies
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'actors'}
          onClick={() => setActiveTab('actors')}
          className={tabClasses(activeTab === 'actors')}
        >
          Favorite Actors
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'tv'}
          onClick={() => setActiveTab('tv')}
          className={tabClasses(activeTab === 'tv')}
        >
          Favorite Web Series
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'movies' ? (
          movieDetails.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movieDetails.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500 transition-shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
                    <p className="text-sm text-gray-400">
                      ({new Date(movie.release_date).getFullYear()})
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-6">You have no favorite movies yet.</p>
          )
        ) : activeTab === 'actors' ? (
          actorDetails.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {actorDetails.map(actor => (
                <Link
                  key={actor.id}
                  to={`/actor/${actor.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500 transition-shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 flex flex-col items-center p-3"
                >
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <h2 className="mt-3 text-lg font-semibold text-center truncate">{actor.name}</h2>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-6">You have no favorite actors yet.</p>
          )
        ) : tvDetails.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tvDetails.map(tv => (
              <Link
                key={tv.id}
                to={`/tv/${tv.id}`}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500 transition-shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
                  alt={tv.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <h2 className="text-lg font-semibold truncate">{tv.name}</h2>
                  <p className="text-sm text-gray-400">
                    ({new Date(tv.first_air_date).getFullYear()})
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-6">You have no favorite web series yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
