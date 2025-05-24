import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MOVIES_PER_PAGE = 20;
const TOTAL_PAGES_TO_FETCH = 5; // 5 pages * 20 = 100 movies

const HighestGrossingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesWithRevenue = async () => {
      setLoading(true);
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        let moviesBasic = [];

        // Step 1: Fetch 5 pages from discover sorted by revenue.desc (100 movies approx)
        for (let p = 1; p <= TOTAL_PAGES_TO_FETCH; p++) {
          const { data } = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=revenue.desc&page=${p}`
          );
          moviesBasic = moviesBasic.concat(data.results);
        }

        // Step 2: Fetch full movie details (including exact revenue)
        const moviesDetailed = await Promise.all(
          moviesBasic.map(async (movie) => {
            const { data } = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
            );
            return {
              id: data.id,
              title: data.title,
              poster_path: data.poster_path,
              vote_average: data.vote_average,
              revenue: data.revenue,
              release_date: data.release_date,
            };
          })
        );

        // Step 3: Sort movies by revenue desc (to fix any inconsistency)
        const sortedMovies = moviesDetailed
          .filter((m) => m.revenue && m.revenue > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 100); // Top 100 revenue movies

        setMovies(sortedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    fetchMoviesWithRevenue();
  }, []);

  const paginatedMovies = movies.slice(
    (page - 1) * MOVIES_PER_PAGE,
    page * MOVIES_PER_PAGE
  );

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold mb-10 text-cyan-400 text-center drop-shadow-[0_0_15px_#00f0ff] animate-pulse">
        ✨ TOP GROSSING MOVIES ✨
      </h1>

      {loading ? (
        <p className="text-center text-xl">Loading movies...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedMovies.map((movie, idx) => {
              const rank = (page - 1) * MOVIES_PER_PAGE + idx + 1;
              return (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-[0_10px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_#00f0ff] transition-shadow duration-300 border-4 border-transparent hover:border-cyan-500"
                  title={`${movie.title} (Rank #${rank})`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                    <p className="text-yellow-400">Rank #{rank}</p>
                    <p className="flex items-center text-yellow-400 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.455a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.386-2.455a1 1 0 00-1.175 0l-3.386 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z"
                        />
                      </svg>
                      {movie.vote_average?.toFixed(1) ?? "N/A"}
                    </p>
                    <p className="text-green-400 font-semibold mt-1">
                      {typeof movie.revenue === "number" && movie.revenue > 0
                        ? `$${movie.revenue.toLocaleString()}`
                        : "Revenue: N/A"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {movie.release_date?.slice(0, 4) || "Unknown"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 gap-3 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-md bg-cyan-700 hover:bg-cyan-500 disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const btnPage = idx + 1;
              return (
                <button
                  key={btnPage}
                  onClick={() => setPage(btnPage)}
                  className={`px-4 py-2 rounded-md ${
                    page === btnPage
                      ? "bg-cyan-400 text-black font-bold"
                      : "bg-gray-700 hover:bg-gray-500"
                  }`}
                >
                  {btnPage}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-md bg-cyan-700 hover:bg-cyan-500 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HighestGrossingMovies;
