// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MovieDetail from './pages/MovieDetail';
import NetflixPage from './pages/NetflixPage';
import LatestPage from './pages/LatestPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import SearchResults from './pages/SearchResults';
import RankingsPage from './pages/RankingsPage';
import Review from './pages/Review';
import HotstarPicks from './pages/HotstarPicks';
import ActorDetail from './pages/ActorDetail';
import ActorList from './pages/ActorList';
import TVDetail from './pages/TVDetail';
import FavoritePages from './pages/FavoritePages';
import FavoriteActorsPage from './pages/FavoriteActorsPage';
import Favorites from './pages/Favorites';
import MoviesByYear from './pages/MoviesByYear';
import TopRatedMovies from './pages/TopRatedMovies';
import HighestGrossingMovies from './pages/HighestGrossingMovies';
import MoviesByAlphabet from './pages/MoviesByAlphabet';
import Genres from './pages/Genres';
import MoviesByGenre from './pages/MoviesByGenre';
import IndianMovies from './pages/IndianMovies';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Logout from './pages/logout';
import ProtectedRoute from './components/ProtectedRoute';
import DeleteAccount from './pages/DeleteAccounts'; // ✅ import
import WebSeries from './pages/WebSeries';
import WebSeriesByGenre from './pages/WebSeriesByGenre';


function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <div className="flex flex-col min-h-screen relative z-10">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/netflix" element={<NetflixPage />} />
              <Route path="/latest" element={<LatestPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/search/:query" element={<SearchResults />} />
              <Route path="/reviews/" element={<Review />} />
              <Route path="/hotstar" element={<HotstarPicks />} />
              <Route path="/actors" element={<ActorList />} />
              <Route path="/actor/:actorId" element={<ActorDetail />} />
              <Route path="/tv/:id" element={<TVDetail />} />
              <Route path="/top-rated" element={<TopRatedMovies />} />
              <Route path="/highest-grossing" element={<HighestGrossingMovies />} />
              <Route path="/by-year" element={<MoviesByYear />} />
              <Route path="/by-alphabet" element={<MoviesByAlphabet />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/webseries" element={<WebSeries/>}/>
              <Route path="/webseries/genre/:genreId/:genreName" element={<WebSeriesByGenre />}
/>

              {/* ✅ Protected Route */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              <Route path="/genres" element={<Genres />} />
              <Route path="/genre/:genreId/:genreName" element={<MoviesByGenre />} />
              <Route path="/indian-movies" element={<IndianMovies />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
