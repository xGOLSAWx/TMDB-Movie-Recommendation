import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/multi`,
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              query: query,
              page: page,
            },
          }
        );
        setResults(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 uppercase text-center">
        Search Results for "{query}" (Page {page})
      </h1>
      {results.length === 0 ? (
        <p className="text-center">No results found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results
              .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
              .map((item) => (
                <Link
                  to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                  key={`${item.media_type}-${item.id}`}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-64 object-cover rounded mb-3"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded mb-3">
                      <span className="text-white">No Image</span>
                    </div>
                  )}
                  <h2 className="text-lg font-bold mb-1 uppercase">{item.title || item.name}</h2>
                  <p className="text-sm text-gray-300 mb-1">
                    Release: {item.release_date || item.first_air_date}
                  </p>
                  <p className="text-sm text-yellow-400 font-semibold">
                    Rating: {item.vote_average}
                  </p>
                </Link>
              ))}
          </div>

          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white px-4 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
