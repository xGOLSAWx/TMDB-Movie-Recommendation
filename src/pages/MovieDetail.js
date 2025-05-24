import React, { useEffect, useState } from 'react';
import { useParams, Link, } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, Film, Clock, Globe2, Heart, User } from 'lucide-react';
import { getCurrentUser } from '../auth/authUtils'; // top of file
import { useNavigate } from 'react-router-dom';

//new
import {
  getUserFavorites,
  addFavorite,
  removeFavorite
} from '../auth/favoriteUtils';


const SectionHeading = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="w-4 h-4 text-yellow-400" />
    <h3 className="text-yellow-300 text-sm font-semibold uppercase tracking-wide">
      {children}
    </h3>
  </div>
);

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();



  // Load initial favorite status from Firestore
  useEffect(() => {
    const checkFav = async () => {
      const user = getCurrentUser();
      if (!user || !user.email) return;
      const favs = await getUserFavorites(user.email);
      setIsFavorite(favs.includes(id));
    };
    checkFav();
  }, [id]);

  const toggleFavorite = async () => {

    const user = getCurrentUser();
    if (!user || !user.email) {
      alert('Please log in to favorite movies!');
       navigate('/login');
      return;
    }

    if (isFavorite) {
      await removeFavorite(user.email, id);
    } else {
      await addFavorite(user.email, id);
    }
    const favs = await getUserFavorites(user.email);
    setIsFavorite(favs.includes(id));
  };


  const prioritizeSimilarMovies = (movies, currentMovie) => {
    if (!currentMovie) return movies;

    const titleWords = currentMovie.title.toLowerCase().split(' ').filter(w => w.length > 2);
    const productionCompanyIds = currentMovie.production_companies?.map(pc => pc.id) || [];
    const genreIds = currentMovie.genres?.map(g => g.id) || [];

    const scoreMovie = (movie) => {
      let score = 0;

      // 1. Same title keywords
      const titleMatch = titleWords.some(word =>
        movie.title.toLowerCase().includes(word)
      );
      if (titleMatch) score += 4;

      // 2. Same production company
      const productionMatch = movie.production_companies?.some(pc =>
        productionCompanyIds.includes(pc.id)
      );
      if (productionMatch) score += 3;

      // 3. Genre match
      const genreMatch = movie.genre_ids?.some(id =>
        genreIds.includes(id)
      );
      if (genreMatch) score += 2;

      return score;
    };

    const sortedMovies = [...movies].sort((a, b) => scoreMovie(b) - scoreMovie(a));
    return sortedMovies;
  };

  // After similarMovies fetch, insert this useEffect:
useEffect(() => {
  const fetchCast = async () => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits`,
      { params: { api_key: apiKey } }
    );
    setCast(data.cast.slice(0, 10)); // top 10
  };
  fetchCast();
}, [id]);



  useEffect(() => {
    const fetchMovieDetails = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: { api_key: apiKey, language: 'en-US' },
        });
        setMovie(data);

        const [videos, allSimilarRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            params: { api_key: apiKey },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`, {
            params: { api_key: apiKey, language: 'en-US' },
          }),
        ]);

        const trailerVideo = videos.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailer(trailerVideo);

        const details = data;
        const allSimilar = allSimilarRes.data.results;

        const collectionMovies = [];
        if (details.belongs_to_collection) {
          const collectionRes = await axios.get(`https://api.themoviedb.org/3/collection/${details.belongs_to_collection.id}`, {
            params: { api_key: apiKey },
          });
          collectionRes.data.parts.forEach(part => {
            if (part.id !== parseInt(id)) {
              collectionMovies.push(part);
            }
          });
        }

        const sameProd = allSimilar.filter(sim =>
          sim.production_companies?.some(pc => details.production_companies.map(p => p.id).includes(pc.id))
        );

        const sameGenre = allSimilar.filter(sim =>
          sim.genre_ids?.some(gid => details.genres.map(g => g.id).includes(gid))
        );

        const fallbackPopular = allSimilar;

        // Merge & deduplicate by movie ID
        const combined = [...collectionMovies, ...sameProd, ...sameGenre, ...fallbackPopular];
        const uniqueMovies = Array.from(new Map(combined.map(m => [m.id, m])).values());

        setSimilarMovies(uniqueMovies.slice(0, 15)); // Max 15 movies
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);



  useEffect(() => {
    const fetchReviews = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews`, {
          params: { api_key: apiKey, language: 'en-US' }
        });
        setReviews(data.results.slice(0, 5)); // Take top 5 reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);


  if (!movie) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="relative text-white min-h-screen pt-16 pb-20 bg-black">
      <div className="fixed top-0 left-0 w-full z-40">
        <Navbar />
      </div>

      {trailer && (
        <div className="fixed inset-0 z-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70" />
        </div>
      )}

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold uppercase movie-title-glitch">{movie.title}</h1>
          <p className="mt-2 text-lg italic text-gray-300">{movie.tagline}</p>
          <button
            onClick={toggleFavorite}
            className={`mt-4 px-4 py-2 rounded-full font-semibold transition shadow-lg ${
              isFavorite ? 'bg-red-600 text-white' : 'bg-gray-700 text-yellow-300'
            }`}
          >
            <Heart className="inline-block mr-2" />
            {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4 lg:col-span-2">
            <div>
              <SectionHeading icon={Film}>Overview</SectionHeading>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-300">
              <div>
                <SectionHeading icon={Clock}>Runtime</SectionHeading>
                <p>{movie.runtime} min</p>
              </div>
              <div>
                <SectionHeading icon={Globe2}>Language</SectionHeading>
                <p>{movie.original_language.toUpperCase()}</p>
              </div>
              <div>
                <SectionHeading icon={Star}>Rating</SectionHeading>
                <p>{movie.vote_average} / 10</p>
              </div>
              <div>
                <SectionHeading icon={Film}>Revenue</SectionHeading>
                <p>${movie.revenue.toLocaleString()}</p>
              </div>
              <div>
                <SectionHeading icon={Film}>Year</SectionHeading>
                <p>{new Date(movie.release_date).getFullYear()}</p>
              </div>
              <div className="col-span-2">
                <SectionHeading icon={Film}>Genres</SectionHeading>
                <p>{movie.genres.map(g => g.name).join(', ')}</p>
              </div>
            </div>
          </div>

          {trailer && (
            <div className="rounded shadow-lg overflow-hidden">
              <iframe
                className="w-full h-64"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Real User Comments */}
        <div className="mt-10">
          <SectionHeading icon={Film}>Top User Comments</SectionHeading>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400">No comments available.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-4 rounded shadow-md">
                  <p className="text-yellow-300 font-semibold mb-1">@{review.author}</p>
                  <p className="text-gray-300 text-sm">{review.content.slice(0, 300)}...</p>
                </div>
              ))
            )}
          </div>
        </div>


        {/* Top Cast */}
        <div className="mt-10">
          <SectionHeading icon={User}>Top Cast</SectionHeading>
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {cast.map(actor => (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`}
                className="flex-shrink-0 text-center"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-yellow-400"
                />
                <p className="mt-2 text-sm text-white">{actor.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Similar Movies */}
        <div className="mt-10">
          <SectionHeading icon={Film}>Similar Movies</SectionHeading>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
              {similarMovies.map(sim => (
                <Link
                  key={sim.id}
                  to={`/movie/${sim.id}`}
                  className="min-w-[160px] flex-shrink-0 rounded overflow-hidden bg-gray-800 hover:bg-gray-700 transition-shadow"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${sim.poster_path}`}
                    alt={sim.title}
                    className="w-full h-48 object-cover"
                  />
                  <p className="text-sm p-2 text-center text-white truncate">{sim.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-40">
        <Footer />
      </div>
    </div>
  );
};

export default MovieDetail;
