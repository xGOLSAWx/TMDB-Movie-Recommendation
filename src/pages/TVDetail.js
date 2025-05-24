// src/pages/TVDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, Film, Clock, Globe2, Heart, User } from 'lucide-react';
import { getCurrentUser } from '../auth/authUtils';
import {
  getUserFavorites,
  getUserFavoriteTV,
  addFavorite,
  removeFavorite,
  addTVToFavorites,
  removeTVFromFavorites
} from '../auth/favoriteUtils';
const SectionHeading = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="w-4 h-4 text-yellow-400" />
    <h3 className="text-yellow-300 text-sm font-semibold uppercase tracking-wide">
      {children}
    </h3>
  </div>
);

const TVDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // ✅ Check if TV show is in favorites
  useEffect(() => {
    const checkFav = async () => {
      const user = getCurrentUser();
      if (!user?.email) return;
      const favs = await getUserFavoriteTV(user.email);
      setIsFavorite(favs.includes(id));
    };
    checkFav();
  }, [id]);

  // ✅ Toggle TV show in favorites
  const toggleFavorite = async () => {
    const user = getCurrentUser();
    if (!user?.email) {
      alert('Please log in to favorite shows!');
      return navigate('/login');
    }
    if (isFavorite) {
      await removeTVFromFavorites(user.email, id);
    } else {
      await addTVToFavorites(user.email, id);

    }
    const favs = await getUserFavoriteTV(user.email);
    setIsFavorite(favs.includes(id));
  };

  // fetch cast
  useEffect(() => {
    const fetchCast = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/credits`,
        { params: { api_key: apiKey } }
      );
      setCast(data.cast.slice(0, 10));
    };
    fetchCast();
  }, [id]);

  // fetch main details
  useEffect(() => {
    const fetchDetails = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}`,
          { params: { api_key: apiKey, language: 'en-US' } }
        );
        setShow(data);

        const [videos, simRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/tv/${id}/videos`, { params: { api_key: apiKey } }),
          axios.get(`https://api.themoviedb.org/3/tv/${id}/similar`, { params: { api_key: apiKey, language: 'en-US' } })
        ]);

        setTrailer(videos.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube'));
        setSimilar(simRes.data.results.slice(0, 15));
      } catch (e) {
        console.error('Error fetching TV details:', e);
      }
    };
    fetchDetails();
  }, [id]);

  // fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/reviews`,
          { params: { api_key: apiKey, language: 'en-US' } }
        );
        setReviews(data.results.slice(0, 5));
      } catch (e) {
        console.error('Error fetching TV reviews:', e);
      }
    };
    fetchReviews();
  }, [id]);

  if (!show) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="relative text-white min-h-screen pt-16 pb-20 bg-black">
      <div className="fixed top-0 left-0 w-full z-40"><Navbar/></div>

      {trailer && (
        <div className="fixed inset-0 z-5 overflow-hidden">
          <div className="w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full object-cover pointer-events-none trailer-iframe"
              title="TV Trailer"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70" />
          </div>
        </div>
      )}

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold uppercase movie-title-glitch">{show.name}</h1>
          {show.tagline && <p className="mt-2 text-lg italic text-gray-300">{show.tagline}</p>}
          <button
            onClick={toggleFavorite}
            className={`mt-4 px-4 py-2 rounded-full font-semibold transition shadow-lg ${
              isFavorite ? 'bg-red-600 text-white' : 'bg-gray-700 text-yellow-300'
            }`}
          >
            <Heart className="inline-block mr-2"/>
            {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview + stats */}
          <div className="space-y-4 lg:col-span-2">
            <SectionHeading icon={Film}>Overview</SectionHeading>
            <p className="text-gray-300 leading-relaxed">{show.overview}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-300">
              <div>
                <SectionHeading icon={Clock}>Seasons</SectionHeading>
                <p>{show.number_of_seasons}</p>
              </div>
              <div>
                <SectionHeading icon={Clock}>Episodes</SectionHeading>
                <p>{show.number_of_episodes}</p>
              </div>
              <div>
                <SectionHeading icon={Globe2}>Language</SectionHeading>
                <p>{show.original_language.toUpperCase()}</p>
              </div>
              <div>
                <SectionHeading icon={Star}>Rating</SectionHeading>
                <p>{show.vote_average} / 10</p>
              </div>
              <div>
                <SectionHeading icon={Film}>First Air</SectionHeading>
                <p>{new Date(show.first_air_date).getFullYear()}</p>
              </div>
              <div>
                <SectionHeading icon={Film}>Last Air</SectionHeading>
                <p>{new Date(show.last_air_date).getFullYear()}</p>
              </div>
              <div className="col-span-2">
                <SectionHeading icon={Film}>Genres</SectionHeading>
                <p>{show.genres.map(g => g.name).join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Trailer embed */}
          {trailer && (
            <div className="rounded shadow-lg overflow-hidden">
              <iframe
                className="w-full h-64"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <SectionHeading icon={Film}>User Reviews</SectionHeading>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews available.</p>
            ) : reviews.map(r => (
              <div key={r.id} className="bg-gray-800 p-4 rounded shadow-md">
                <p className="text-yellow-300 font-semibold mb-1">@{r.author}</p>
                <p className="text-gray-300 text-sm">{r.content.slice(0,300)}…</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cast */}
        <div className="mt-10">
          <SectionHeading icon={User}>Top Cast</SectionHeading>
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {cast.map(a => (
              <Link key={a.id} to={`/actor/${a.id}`} className="flex-shrink-0 text-center">
                <img
                  src={a.profile_path
                    ? `https://image.tmdb.org/t/p/w185${a.profile_path}`
                    : '/no-image.png'}
                  alt={a.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-yellow-400"
                />
                <p className="mt-2 text-sm text-white">{a.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Similar Shows */}
        <div className="mt-10">
          <SectionHeading icon={Film}>Similar Shows</SectionHeading>
          <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
            {similar.map(s => (
              <Link
                key={s.id}
                to={`/tv/${s.id}`}
                className="min-w-[160px] flex-shrink-0 rounded overflow-hidden bg-gray-800 hover:bg-gray-700 transition-shadow"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${s.poster_path}`}
                  alt={s.name}
                  className="w-full h-48 object-cover"
                />
                <p className="text-sm p-2 text-center text-white truncate">{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default TVDetail;
