import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const genresToShow = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music"
];

export const Home = () => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  const navigate = useNavigate();

  // carousel for latest
  const [latest, setLatest] = useState([]);
  const latestRef = useRef(null);

  // fetch latest 5 movies
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
          params: { api_key: apiKey, page: 1 }
        });
        setLatest(res.data.results.slice(0, 5));
      } catch (err) {
        console.error('Error fetching latest:', err);
      }
    };
    fetchLatest();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (latest.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % latest.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [latest]);

  // auto-scroll with loop
  useEffect(() => {
    const interval = setInterval(() => {
      const el = latestRef.current;
      if (el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 1) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 600, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [latest]);

  // genres fetching
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [trailers, setTrailers] = useState({});
  //new
  const [hoveredCard, setHoveredCard] = useState(null);
  const [genresMap, setGenresMap] = useState({}); // ✅ Added
  const genreRefs = useRef({});

  useEffect(() => {
    const fetchByGenre = async () => {
      const { data: { genres } } = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list',
        { params: { api_key: apiKey } }
      );
      const mapId = {};
      genres.forEach(g => (mapId[g.name] = g.id));
      setGenresMap(mapId); // ✅ Store genre name → id map

      const out = {};
      await Promise.all(
        genresToShow.map(async name => {
          const id = mapId[name];
          if (!id) return;
          const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: { api_key: apiKey, with_genres: id, sort_by: 'popularity.desc', page: 1 }
          });
          out[name] = data.results.slice(0, 12);
        })
      );
      setMoviesByGenre(out);
    };
    fetchByGenre();
  }, []);

  const fetchTrailer = async id => {
    if (trailers[id]) return;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      { params: { api_key: apiKey } }
    );
    const tr = data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (tr) setTrailers(prev => ({ ...prev, [id]: tr.key }));
  };

  const scrollContainer = (refObj, dir = 'left') => {
    if (refObj.current) {
      refObj.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-white p-4 space-y-10">
      {/* Top carousel */}
      <div className="relative w-full h-[420px] overflow-hidden rounded-lg">
        {/* Left and right fade overlays */}
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-900 pointer-events-none z-20" />
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-900 pointer-events-none z-20" />

        {latest.map((m, index) => (
          <Link
            key={m.id}
            to={`/movie/${m.id}`}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-opacity duration-[1500ms] ease-in-out
              ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ width: '90%', height: '420px' }}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${m.backdrop_path}`}
              alt={m.title}
              className="w-full h-full object-center object-centre rounded-lg scale-[1] transition-transform duration-[1500ms]"
            />
            {/* Gradient fade at bottom for smooth merging */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[rgba(0,0,0,0.5)] via-[rgba(0,0,0,0.2)] to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 w-[calc(100%-3rem)] z-20 text-white">
              <h3 className="text-3xl font-bold truncate">{m.title}</h3>
              <div className="flex items-center font-bold text-red-400 text-2xl space-x-3 mt-2">
                <span>{new Date(m.release_date).getFullYear()}</span>
                <span>•</span>
                <span>⭐ {m.vote_average.toFixed(1)}</span>
              </div>
              <p className="mt-3 text-base line-clamp-3 text-gray-200 font-bold">{m.overview}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Genres */}
      {Object.entries(moviesByGenre).map(([genre, movies]) => (
        <div key={genre} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{genre}</h2>
            {/* ✅ Updated More button to use genre ID + name in URL */}
            <button
              onClick={() => navigate(`/genre/${genresMap[genre]}/${genre.toLowerCase()}`)}
              className="text-sm text-blue-400 hover:underline bg-transparent border-none cursor-pointer"
              aria-label={`More ${genre} movies`}
            >
              More
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollContainer({ current: genreRefs.current[genre] }, 'left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10"
            >◀</button>

            <div
              ref={el => (genreRefs.current[genre] = el)}
              className="flex overflow-x-scroll gap-4 scroll-smooth"
            >
              {movies.map(movie => (
                <div
                  key={movie.id}
                  //new
                  onMouseEnter={() => { setHoveredCard(`${genre}-${movie.id}`); fetchTrailer(movie.id); }}
                  onMouseLeave={() => setHoveredCard(null)}

                  className="relative w-48 h-72 flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-400 transition"
                >
                  {hoveredCard === `${genre}-${movie.id}` && trailers[movie.id] ? (

                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${trailers[movie.id]}?autoplay=1&mute=0&controls=0&loop=1&playlist=${trailers[movie.id]}&modestbranding=1&rel=0`}
                      title={movie.title}
                      allow="autoplay; encrypted-media"
                    />
                  ) : (
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : '/placeholder.png'
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <Link to={`/movie/${movie.id}`} className="absolute inset-0" />

                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-2 text-sm">
                    <p className="font-semibold truncate">{movie.title}</p>
                    <p>{new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollContainer({ current: genreRefs.current[genre] }, 'right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10"
            >▶</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
