import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ITEMS_PER_PAGE = 25; // 5x5 grid

const glitchStyle = {
  animation: 'glitch 1.5s infinite',
  position: 'relative',
  color: '#FFD700',
  textShadow: `
    2px 0 red,
    -2px 0 cyan,
    0 2px lime,
    0 -2px magenta
  `,
  cursor: 'pointer',
};

const MovieTVGrid = () => {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [items, setItems] = useState([]); // movies + tv shows filtered by letter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch movies and TV shows starting with selectedLetter, up to enough pages
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setItems([]);
      setPage(1);

      try {
        const combinedResults = [];
        let moviePage = 1;
        let tvPage = 1;
        const maxPagesToFetch = 300; // limit requests

        // Helper to fetch and filter by selectedLetter
        const fetchFiltered = async (type, pageNum) => {
          const url = `https://api.themoviedb.org/3/${type}/popular`;
          const res = await axios.get(url, {
            params: {
              api_key: API_KEY,
              language: 'en-US',
              page: pageNum,
            },
          });
          // Filter by title/ name starting with selectedLetter
          const filtered = res.data.results.filter((item) => {
            const title = type === 'movie' ? item.title : item.name;
            return title && title[0].toUpperCase() === selectedLetter;
          });
          return { filtered, totalPages: res.data.total_pages };
        };

        // Fetch pages from both movie and tv until enough data or max pages reached
        while (combinedResults.length < ITEMS_PER_PAGE * maxPagesToFetch && (moviePage <= maxPagesToFetch || tvPage <= maxPagesToFetch)) {
          if (moviePage <= maxPagesToFetch) {
            const { filtered, totalPages: movieTotal } = await fetchFiltered('movie', moviePage);
            combinedResults.push(...filtered);
            if (moviePage >= movieTotal) moviePage = maxPagesToFetch + 1; else moviePage++;
          }
          if (tvPage <= maxPagesToFetch) {
            const { filtered, totalPages: tvTotal } = await fetchFiltered('tv', tvPage);
            combinedResults.push(...filtered);
            if (tvPage >= tvTotal) tvPage = maxPagesToFetch + 1; else tvPage++;
          }
        }

        // Remove duplicates (same id & type)
        const uniqueItems = combinedResults.filter((item, index, self) =>
          index === self.findIndex(t => t.id === item.id && (t.title || t.name) === (item.title || item.name))
        );

        setItems(uniqueItems);

        const calcPages = Math.ceil(uniqueItems.length / ITEMS_PER_PAGE);
        setTotalPages(calcPages || 1);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
        setPage(1);
      }
    };

    fetchData();
  }, [selectedLetter]);

  // Slice items for current page
  const pagedItems = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Pagination helpers
  const goPrevPage = () => setPage(p => Math.max(1, p - 1));
  const goNextPage = () => setPage(p => Math.min(totalPages, p + 1));
  const goPage = (p) => setPage(p);

  // Page numbers with simple ... dots if needed
  const getPageNumbers = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);

    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    
    <section className="text-yellow-400 bg-gray-900 p-4 rounded-md max-w-7xl mx-auto">
        
        

      {/* Alphabets */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {ALPHABETS.map(letter => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            aria-pressed={selectedLetter === letter}
            className={`w-12 h-12 flex items-center justify-center font-bold rounded-full
              ${selectedLetter === letter
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-gray-700 hover:bg-yellow-500 hover:text-black'}
              transition-colors duration-300`}
            style={selectedLetter === letter ? glitchStyle : {}}
            aria-label={`Filter movies and TV shows starting with letter ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-yellow-300 animate-pulse">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Grid */}
      {!loading && !error && pagedItems.length === 0 && (
        <p className="text-center text-yellow-400">No movies or TV shows found starting with "{selectedLetter}"</p>
      )}

      {!loading && !error && pagedItems.length > 0 && (
        <div
          className="grid grid-cols-5 gap-6"
          role="list"
          aria-label={`Movies and TV shows starting with letter ${selectedLetter} page ${page}`}
        >
          {pagedItems.map(item => {
            const title = item.title || item.name || 'No Title';
            const date = (item.release_date || item.first_air_date || 'N/A').slice(0, 4);
            const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
            const poster = item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : null;

            return (
            <Link
              key={`${item.id}-${item.media_type}`}
              to={`/movie/${item.id}`}
              role="listitem"
              tabIndex={0}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400 transition-shadow cursor-pointer"
            >
    {/* image and content */}
  
                {poster ? (
                  <img
                    src={poster}
                    alt={`Poster of ${title}`}
                    className="w-full h-48 object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-yellow-400 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-3">
                  <h2 className="text-yellow-400 font-semibold text-lg truncate" title={title}>{title}</h2>
                  <p className="text-gray-400 mt-1">{date}</p>
                  <div className="flex items-center mt-2" aria-label={`Rating: ${rating}`}>
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.959c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.959a1 1 0 00-.364-1.118L2.035 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
                    </svg>
                    <span className="text-yellow-400 font-bold">{rating}</span>
                  </div>
                </div>
                </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-2 mt-10 flex-wrap"
          aria-label="Pagination Navigation"
        >
          <button
            onClick={goPrevPage}
            disabled={page === 1}
            aria-disabled={page === 1}
            aria-label="Previous Page"
            className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            ◀ Prev
          </button>

          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span
                key={`dots-${i}`}
                className="px-3 py-2 text-gray-400 select-none"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goPage(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`px-4 py-2 rounded-full font-semibold
                  ${p === page
                    ? 'bg-yellow-400 text-black shadow-lg'
                    : 'bg-gray-700 text-yellow-400 hover:bg-yellow-500 hover:text-black'}
                `}
              >
                {p}.
              </button>
            )
          )}

          <button
            onClick={goNextPage}
            disabled={page === totalPages}
            aria-disabled={page === totalPages}
            aria-label="Next Page"
            className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            Next ▶
          </button>
        </nav>
      )}

      {/* Glitch effect keyframes */}
      <style>{`
        @keyframes glitch {
          0% {
            text-shadow:
              2px 0 red,
              -2px 0 cyan,
              0 2px lime,
              0 -2px magenta;
          }
          20% {
            text-shadow:
              3px 0 red,
              -1px 0 cyan,
              0 3px lime,
              0 -1px magenta;
          }
          40% {
            text-shadow:
              2px 0 red,
              -2px 0 cyan,
              0 2px lime,
              0 -2px magenta;
          }
          60% {
            text-shadow:
              1px 0 red,
              -3px 0 cyan,
              0 1px lime,
              0 -3px magenta;
          }
          80% {
            text-shadow:
              2px 0 red,
              -2px 0 cyan,
              0 2px lime,
              0 -2px magenta;
          }
          100% {
            text-shadow:
              3px 0 red,
              -1px 0 cyan,
              0 3px lime,
              0 -1px magenta;
          }
        }
      `}</style>
    </section>
  );
};

export default MovieTVGrid;
