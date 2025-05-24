// TopRatedMovies.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const stars = (rating) => {
  const starCount = Math.round(rating / 2);
  return [...Array(5)].map((_, i) => (
    <span key={i} className={`text-lg ${i < starCount ? 'text-yellow-400' : 'text-gray-600'}`}>
      ★
    </span>
  ));
};

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const MOVIES_PER_PAGE = 20;
  const totalPages = 10;

  useEffect(() => {
    const fetchTopRated = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };
    fetchTopRated();
  }, [page]);

  return (
    <div className="min-h-screen p-6 text-white relative z-10">
      {/* Glowy Rainbow Title */}
      <h1
        className="text-4xl font-extrabold mb-8 text-center"
        style={{
          background: 'linear-gradient(90deg, #ff00cc, #3333ff, #00e5ff, #00ff99, #ffeb3b, #ff5722, #ff00cc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'gradient',
          textShadow:
            '0 0 8px #fff, 0 0 16px #00e5ff, 0 0 32px #ff00cc, 0 0 48px #ffeb3b',
        }}
      >
        ☝TOP Rated☝
      </h1>

      {/* Movies Grid */}
      <div
        className="grid gap-6 justify-center"
        style={{
          gridTemplateColumns: 'repeat(5, 220px)',
          justifyContent: 'center',
        }}
      >
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="bg-gray-800 rounded-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-[0_15px_25px_rgba(0,229,255,0.6),inset_0_0_15px_rgba(0,229,255,0.3)]"
            style={{
              width: '220px',
              height: '340px',
              boxShadow: '0 8px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2)',
              perspective: '600px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotateX(8deg) rotateY(8deg) scale(1.05)';
              e.currentTarget.style.boxShadow =
                '0 15px 25px rgba(0,229,255,0.6), inset 0 0 15px rgba(0,229,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateX(0) rotateY(0) scale(1)';
              e.currentTarget.style.boxShadow =
                '0 8px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2)';
            }}
          >
            <div
              style={{
                height: '260px',
                overflow: 'hidden',
                borderTopLeftRadius: '0.75rem',
                borderTopRightRadius: '0.75rem',
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 bg-gray-900 rounded-b-xl flex flex-col justify-between h-24">
              <h3 className="text-md font-semibold truncate mb-1" title={movie.title}>
                {movie.title}
              </h3>

              <div className="flex items-center space-x-2 text-sm ">
                <div>{stars(movie.vote_average)}</div>
                <span className="text-gray-400">({movie.vote_average.toFixed(1)})</span>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  <strong>Year: </strong>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 border border-cyan-400 rounded-md font-semibold transition-colors ${
            page === 1
              ? 'text-gray-500 border-gray-600 cursor-not-allowed'
              : 'text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 border rounded-md font-semibold transition-colors ${
                page === pageNum
                  ? 'bg-cyan-400 text-gray-900 border-cyan-400'
                  : 'text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 border border-cyan-400 rounded-md font-semibold transition-colors ${
            page === totalPages
              ? 'text-gray-500 border-gray-600 cursor-not-allowed'
              : 'text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopRatedMovies;
