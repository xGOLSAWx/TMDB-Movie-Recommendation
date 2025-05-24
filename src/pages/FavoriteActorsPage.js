import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FavoriteActorsPage = () => {
  const [favoriteActors, setFavoriteActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteActors') || '[]');
      try {
        setLoading(true);
        const actorDetailsPromises = storedFavorites.map(id =>
          axios.get(`https://api.themoviedb.org/3/person/${id}`, {
            params: { api_key: apiKey },
          }).then(res => res.data)
        );
        const actors = await Promise.all(actorDetailsPromises);
        setFavoriteActors(actors);
      } catch (error) {
        console.error('Failed to fetch favorite actors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [apiKey]);

  if (loading) return <div className="text-white p-4">Loading favorites...</div>;

  if (favoriteActors.length === 0) return <div className="text-white p-4">No favorite actors yet.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-yellow-400 text-3xl mb-6">Your Favorite Actors</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {favoriteActors.map(actor => (
          <li key={actor.id} className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-yellow-400">
            <Link to={`/actor/${actor.id}`}>
              <img
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                alt={actor.name}
                className="w-full rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{actor.name}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteActorsPage;
