import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RankingsPage = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('top_rated');

  const rankingCategories = [
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'most_watched_weekly', label: 'Most Watched (Weekly)' },
    { key: 'most_watched_monthly', label: 'Most Watched (Monthly)' },
    { key: 'most_watched_yearly', label: 'Most Watched (Yearly)' },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let endpoint = '';
        let params = {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          sort_by: 'popularity.desc',
        };

        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const yearStart = `${today.getFullYear()}-01-01`;

        switch (category) {
          case 'top_rated':
            endpoint = `https://api.themoviedb.org/3/movie/top_rated`;
            break;
          case 'most_watched_weekly':
            endpoint = `https://api.themoviedb.org/3/trending/movie/week`;
            break;
          case 'most_watched_monthly':
            endpoint = `https://api.themoviedb.org/3/discover/movie`;
            params['primary_release_date.gte'] = thirtyDaysAgo.toISOString().split('T')[0];
            params['primary_release_date.lte'] = today.toISOString().split('T')[0];
            break;
          case 'most_watched_yearly':
            endpoint = `https://api.themoviedb.org/3/discover/movie`;
            params['primary_release_date.gte'] = yearStart;
            params['primary_release_date.lte'] = today.toISOString().split('T')[0];
            break;
          default:
            endpoint = `https://api.themoviedb.org/3/movie/top_rated`;
        }

        const response = await axios.get(endpoint, { params });
        setMovies(response.data.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, [category]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4 uppercase text-center">Movie Rankings</h1>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {rankingCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-md ${
              category === cat.key ? 'bg-yellow-500 text-black' : 'bg-gray-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover rounded mb-3"
              />
            ) : (
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded mb-3">
                <span>No Image</span>
              </div>
            )}
            <h2 className="text-lg font-bold mb-1 uppercase">{movie.title}</h2>
            <p className="text-sm text-gray-300 mb-1">Release: {movie.release_date}</p>
            <p className="text-sm text-yellow-400 font-semibold">Rating: {movie.vote_average}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RankingsPage;
