import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NetflixPage = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contentType, setContentType] = useState('movie'); // 'movie' or 'tv'
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const fetchGenres = async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/genre/${contentType}/list`, {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
        },
      });
      setGenres(res.data.genres);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  };

  const fetchNetflixPicks = async (pageNumber, type, genreId) => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          with_watch_providers: 8,
          watch_region: 'US',
          sort_by: 'release_date.desc',
          with_genres: genreId || '',
          page: pageNumber,
        },
      });
      setItems(res.data.results);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error('Failed to fetch Netflix picks:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [contentType]);

  useEffect(() => {
    fetchNetflixPicks(page, contentType, selectedGenre);
  }, [page, contentType, selectedGenre]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 text-white text-center">Netflix Picks</h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <div>
          <select
            value={selectedGenre}
            onChange={(e) => { setSelectedGenre(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded bg-gray-800 text-white"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setContentType('movie'); setPage(1); }}
            className={`px-4 py-2 rounded ${contentType === 'movie' ? 'bg-yellow-500' : 'bg-gray-700'} text-white`}
          >
            Movies
          </button>
          <button
            onClick={() => { setContentType('tv'); setPage(1); }}
            className={`px-4 py-2 rounded ${contentType === 'tv' ? 'bg-yellow-500' : 'bg-gray-700'} text-white`}
          >
            TV Series
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/${contentType}/${item.id}`}
            className="transition-transform duration-300 transform hover:scale-105"
          >
            <div className="rounded-lg overflow-hidden bg-transparent shadow-md hover:shadow-xl">
              <div className="aspect-[2/3] bg-black">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={contentType === 'movie' ? item.title : item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 bg-transparent">
                <h2 className="text-white text-sm text-center font-medium truncate">
                  {contentType === 'movie' ? item.title : item.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10 text-yellow-400 font-medium">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">Page {page}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NetflixPage;
