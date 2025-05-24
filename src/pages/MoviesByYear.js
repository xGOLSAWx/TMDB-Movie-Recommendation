import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Star rating component
const Stars = ({ rating }) => {
  const starCount = Math.round(rating / 2);
  return [...Array(5)].map((_, i) => (
    <span key={i} className={`text-lg ${i < starCount ? 'text-yellow-400' : 'text-gray-600'}`}>
      ★
    </span>
  ));
};

const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const MoviesByYear = () => {
  const [movies, setMovies] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const MOVIES_PER_PAGE = 20;

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&primary_release_year=${selectedYear}&page=${page}`
        );
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages); // TMDB caps at 500 pages
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [selectedYear, page]);

  // Wavy + glitchy effect styles
  const glitchyTextStyle = {
    position: 'relative',
    fontSize: '3rem',
    fontWeight: '900',
    color: '#00e5ff',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    animation: 'wavy 2s ease-in-out infinite',
  };

  return (
    <>
      <style>{`
        @keyframes wavy {
          0%, 100% {
            text-shadow:
              0 0 5px #00e5ff,
              0 0 10px #00e5ff,
              0 0 20px #00e5ff,
              0 0 40px #00e5ff;
          }
          50% {
            text-shadow:
              2px 0 10px #ff00c8,
              -2px 0 10px #00ffe3,
              0 0 20px #00e5ff,
              0 0 40px #00e5ff;
          }
        }
        @keyframes glitch {
          0% {
            clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
            transform: translate(0);
          }
          20% {
            clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%);
            transform: translate(-2px, -2px);
          }
          40% {
            clip-path: polygon(0 30%, 100% 30%, 100% 35%, 0 35%);
            transform: translate(2px, 2px);
          }
          60% {
            clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%);
            transform: translate(-2px, 2px);
          }
          80% {
            clip-path: polygon(0 60%, 100% 60%, 100% 65%, 0 65%);
            transform: translate(2px, -2px);
          }
          100% {
            clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
            transform: translate(0);
          }
        }
        .glitch {
          position: relative;
          color: #00e5ff;
          font-weight: 900;
          font-size: 3rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: wavy 2s ease-in-out infinite;
        }
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          right: 0;
          opacity: 0.8;
          clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
          animation: glitch 2s infinite;
        }
        .glitch::before {
          top: -2px;
          color: #ff00c8;
          animation-delay: 0.1s;
        }
        .glitch::after {
          top: 2px;
          color: #00ffe3;
          animation-delay: 0.2s;
        }
      `}</style>

      <div className="min-h-screen p-6 text-white relative z-10">
        <h1 className="glitch" data-text="TOP Rated">
          TOP Rated
        </h1>

        {/* Year Selector */}
        <div className="flex flex-wrap gap-2 my-6 justify-center">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setPage(1);
              }}
              className={`px-4 py-1 rounded-full border text-sm font-semibold transition-all duration-200
                ${
                  selectedYear === year
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.8)] translate-y-0.5'
                    : 'border-yellow-400 text-yellow-400 hover:bg-yellow-300 hover:text-black hover:shadow-md'
                }
              `}
              style={{
                boxShadow:
                  selectedYear === year
                    ? '0 4px 15px rgba(255, 215, 0, 0.7)'
                    : 'none',
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        <div
          className="grid gap-6 justify-center mx-auto"
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
                boxShadow:
                  '0 8px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.2)',
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

              <div className="p-3 bg-gray-900 rounded-b-xl flex flex-col justify-between h-20">
                <h3
                  className="text-md font-semibold truncate mb-1"
                  title={movie.title}
                >
                  {movie.title}
                </h3>

                <div className="flex items-center space-x-2 text-sm mb-1">
                  <Stars rating={movie.vote_average} />
                  <span className="text-gray-400">
                    ({movie.vote_average.toFixed(1)})
                  </span>
                </div>

                <div className="text-xs text-gray-400">
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : 'N/A'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded bg-yellow-400 text-black font-semibold disabled:opacity-50"
          >
            Previous
          </button>

          {/* Show pages (limit to max 7 page buttons) */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 2 && pageNum <= page + 2)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded font-semibold ${
                    pageNum === page
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            // Show ellipsis if next page is far away
            if (
              pageNum === page - 3 ||
              pageNum === page + 3
            ) {
              return (
                <span key={pageNum} className="px-2 text-yellow-400 font-bold">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded bg-yellow-400 text-black font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default MoviesByYear;
