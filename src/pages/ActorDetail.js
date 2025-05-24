import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from '../auth/authUtils';                                    // ← added
import {
  getUserFavoriteActors,
  addActorToFavorites,
  removeActorFromFavorites
} from '../auth/favoriteUtils'; 

const ActorDetail = () => {
  const { actorId } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [topGrossing, setTopGrossing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [netWorth, setNetWorth] = useState('N/A');

  // ⭐ Favorite State Logic
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFav = async () => {
      const user = getCurrentUser();                                                   // ← new
      if (!user || !user.email) return;                                                // ← new
      const favs = await getUserFavoriteActors(user.email);                             // ← replaced
      setIsFavorite(favs.includes(actorId));
    };
    checkFav();
  }, [actorId]);

  const toggleFavorite = async () => {
    const user = getCurrentUser();                                                     // ← new
    if (!user || !user.email) {
      alert('Please log in to favorite actors!');
      return;
    }
    if (isFavorite) {
      await removeActorFromFavorites(user.email, actorId);                              // ← replaced
      setIsFavorite(false);
    } else {
      await addActorToFavorites(user.email, actorId);                                   // ← replaced
      setIsFavorite(true);
    }
  };

  useEffect(() => {
    const fetchActorDetails = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        setLoading(true);

        const actorRes = await axios.get(`https://api.themoviedb.org/3/person/${actorId}`, {
          params: { api_key: apiKey },
        });

        const creditsRes = await axios.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits`, {
          params: { api_key: apiKey },
        });

        setActor(actorRes.data);

        const sortedByPopularity = creditsRes.data.cast
          .filter(m => m.release_date)
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 10);

        setMovies(sortedByPopularity);

        const movieDetailsPromises = sortedByPopularity.slice(0, 20).map(async (movie) => {
          try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
              params: { api_key: apiKey },
            });
            return { ...movie, revenue: res.data.revenue || 0 };
          } catch {
            return { ...movie, revenue: 0 };
          }
        });

        const detailedMovies = await Promise.all(movieDetailsPromises);

        const topGrossingSorted = detailedMovies
          .filter(m => m.revenue && m.revenue > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopGrossing(topGrossingSorted);
        const totalRevenue = topGrossingSorted.reduce((sum, movie) => sum + (movie.revenue || 0), 0);
        setNetWorth(`$${totalRevenue.toLocaleString()}`);
      } catch (error) {
        console.error('Failed to fetch actor details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [actorId]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!actor) return <div className="text-white p-4">Actor not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Link to="/" className="text-yellow-400 underline mb-6 inline-block">← Back to Home</Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Actor Photo and Basic Info */}
        <div className="md:w-1/3 flex flex-col items-center">
          {actor.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
              alt={actor.name}
              className="rounded-lg shadow-lg mb-4"
            />
          ) : (
            <div className="bg-gray-700 w-64 h-96 flex items-center justify-center rounded-lg text-gray-400 mb-4">
              No Image
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>

          {/* ⭐ Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`mt-2 px-4 py-2 rounded transition font-semibold ${
              isFavorite ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-700 hover:bg-gray-800 text-yellow-300'
            }`}
          >
            {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
          </button>

          <p className="text-gray-400 mt-3"><strong>Birthday:</strong> {actor.birthday || 'Unknown'}</p>
          <p className="text-gray-400"><strong>Place of Birth:</strong> {actor.place_of_birth || 'Unknown'}</p>
          <p className="text-gray-400"><strong>Known For:</strong> {actor.known_for_department || 'N/A'}</p>
          <p className="text-gray-400"><strong>Net Worth:</strong> {netWorth}</p>
        </div>

        {/* Biography and Filmography */}
        <div className="md:w-2/3 space-y-6">
          <div>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Biography</h2>
            <p className="whitespace-pre-line">{actor.biography || 'No biography available.'}</p>
          </div>

          <div>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Known Movies</h2>
            {movies.length === 0 ? (
              <p>No movies found for this actor.</p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {movies.map((movie) => (
                  <li key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500 transition-shadow">
                    <Link to={`/movie/${movie.id}`} className="block">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="p-2">
                        <h3 className="font-semibold text-sm">{movie.title}</h3>
                        <p className="text-xs text-gray-400">{movie.release_date}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-yellow-400 text-xl font-semibold mb-4">Top 5 Highest Grossing Films</h2>
            {topGrossing.length === 0 ? (
              <p>No grossing data available.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topGrossing.map((movie) => (
                  <Link to={`/movie/${movie.id}`} key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500 transition-shadow flex">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                        alt={movie.title}
                        className="w-24 object-cover"
                      />
                    ) : (
                      <div className="w-24 bg-gray-700 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="p-2 flex flex-col justify-center">
                      <h3 className="font-semibold">{movie.title}</h3>
                      <p className="text-xs text-gray-400">{movie.release_date}</p>
                      <p className="text-sm font-semibold text-yellow-400">
                        Revenue: ${movie.revenue.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetail;
