import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LatestPage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            page: page,
          },
        });
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error('Failed to fetch now playing movies:', err);
      }
    };
    fetchNowPlayingMovies();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Now Playing in Theaters</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="hover:scale-105 transform transition duration-200">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded"
            />
            <h2 className="mt-2 text-center text-sm">{movie.title}</h2>
          </Link>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LatestPage;
