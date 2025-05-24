// src/pages/WebSeriesByGenre.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ReactPlayer from 'react-player/youtube';
import './IndianMovies.css';

const WebSeriesByGenre = () => {
  const { genreId, genreName } = useParams();
  const [searchParams] = useSearchParams();
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('popularity.desc');
  const [hoveredId, setHoveredId] = useState(null);
  const [trailers, setTrailers] = useState({});

  useEffect(() => {
    const fetchSeries = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const region = searchParams.get('region');
      const type = searchParams.get('type') || 'tv'; // should be 'tv'

      let url = `https://api.themoviedb.org/3/discover/${type}`;
      let params = {
        api_key: apiKey,
        language: 'en-US',
        with_genres: genreId,
        sort_by: sortOption,
        page,
      };
      if (region === 'IN' && type === 'tv') {
        params.region = 'IN';
        params.with_original_language = 'hi';
      }

      const { data } = await axios.get(url, { params });
      const valid = data.results.filter((s) => s.poster_path);
      setSeries(valid);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
    };

    fetchSeries();
  }, [genreId, page, sortOption, searchParams]);

  useEffect(() => {
    const fetchAllTrailers = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const map = {};
      await Promise.all(
        series.map(async (s) => {
          try {
            const { data } = await axios.get(
              `https://api.themoviedb.org/3/tv/${s.id}/videos`,
              { params: { api_key: apiKey } }
            );
            const yt = data.results.find(
              (v) => v.site === 'YouTube' && v.type === 'Trailer'
            );
            if (yt) map[s.id] = `https://www.youtube.com/watch?v=${yt.key}`;
          } catch {}
        })
      );
      setTrailers(map);
    };
    if (series.length) fetchAllTrailers();
  }, [series]);

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold mb-4 text-center border-b-2 border-yellow-400 pb-2">
        {genreName} Series
      </h1>

      {/* Sort control */}
      <div className="flex justify-center gap-4 mb-6">
        <select
          value={sortOption}
          onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-yellow-400"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Top Rated</option>
          <option value="first_air_date.desc">Newest</option>
          <option value="first_air_date.asc">Oldest</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {series.map((s) => (
          <Link
            to={`/tv/${s.id}`}
            key={s.id}
            className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {hoveredId === s.id && trailers[s.id] ? (
              <div className="absolute inset-0 z-10">
                <ReactPlayer
                  url={trailers[s.id]}
                  playing
                  muted={false}
                  controls={false}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
                />
              </div>
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w300${s.poster_path}`}
                alt={s.name}
                className="w-full h-80 object-cover"
              />
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-3 z-20">
              <h3 className="text-sm font-semibold truncate">{s.name}</h3>
              <div className="flex items-center text-sm">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{s.vote_average?.toFixed(1)}</span>
                <span className="ml-2">
                  {s.first_air_date
                    ? new Date(s.first_air_date).getFullYear()
                    : 'N/A'}
                </span>
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
          className="px-4 py-2 bg-yellow-400 text-black font-bold rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const num = i + 1;
          if (
            num === 1 ||
            num === totalPages ||
            (num >= page - 2 && num <= page + 2)
          ) {
            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded font-semibold ${
                  num === page
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-700 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {num}
              </button>
            );
          }
          if (num === page - 3 || num === page + 3) {
            return (
              <span key={num} className="px-2 text-yellow-400 font-bold">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 bg-yellow-400 text-black font-bold rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WebSeriesByGenre;
