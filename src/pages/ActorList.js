import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ActorsList = () => {
  const [maleActors, setMaleActors] = useState([]);
  const [femaleActors, setFemaleActors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // New state for dropdown filter ('All' | 'Male' | 'Female')
  const [genderFilter, setGenderFilter] = useState('All');

  // New states for page input and error
  const [inputPage, setInputPage] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const fetchPopularActors = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      try {
        setLoading(true);
        const res = await axios.get('https://api.themoviedb.org/3/person/popular', {
          params: { api_key: apiKey, page },
        });
        const fetchedActors = res.data.results;
        setTotalPages(res.data.total_pages);

        const males = fetchedActors.filter((actor) => actor.gender === 2);
        const females = fetchedActors.filter((actor) => actor.gender === 1);

        setMaleActors(males);
        setFemaleActors(females);
      } catch (error) {
        console.error('Error fetching popular actors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularActors();
  }, [page]);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && page > 1) setPage(page - 1);
    if (direction === 'next' && page < totalPages) setPage(page + 1);
  };

  // Handler for jumping to page by input
  const handleJumpToPage = () => {
    const pageNum = Number(inputPage);
    if (
      isNaN(pageNum) ||
      pageNum < 1 ||
      pageNum > totalPages ||
      !Number.isInteger(pageNum)
    ) {
      setInputError(`Please enter a valid page number between 1 and ${totalPages}`);
    } else {
      setPage(pageNum);
      setInputError('');
      setInputPage('');
    }
  };

  if (loading) return <div className="text-white p-4">Loading popular actors...</div>;

  return (
    <div className="px-6 py-8 text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-black text-center">
        POPULAR ACTORS (Page {page})
      </h1>

      {/* Gender Filter Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="flex justify-center items-center gap-4 mb-4 text-yellow-400 font-medium">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">Page {page}</span>
        <button
          onClick={() => handlePageChange('next')}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Page jump input and Go button */}
      <div className="flex justify-center items-center gap-2 mb-10">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="Go to page"
          className="w-20 px-2 py-1 rounded text-black"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleJumpToPage();
            }
          }}
        />
        <button
          onClick={handleJumpToPage}
          className="px-4 py-1 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
        >
          Go
        </button>
      </div>
      {inputError && (
        <p className="text-red-500 text-center mb-4">{inputError}</p>
      )}

      {/* Conditionally render actors based on filter */}

      {(genderFilter === 'All' || genderFilter === 'Male') && (
        <div className="mb-12">
          <h2 className="text-xl text-blue-400 mb-4 font-semibold text-center">Male Actors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {maleActors.map((actor) => (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`}
                className="transition-transform duration-300 transform hover:scale-105"
              >
                <div className="rounded-lg overflow-hidden bg-transparent shadow-md hover:shadow-yellow-500">
                  <div className="aspect-[2/3] bg-black">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-transparent">
                    <h3 className="text-white text-sm text-center font-medium truncate">
                      {actor.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(genderFilter === 'All' || genderFilter === 'Female') && (
        <div>
          <h2 className="text-xl text-pink-400 mb-4 font-semibold text-center">Female Actors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {femaleActors.map((actor) => (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`}
                className="transition-transform duration-300 transform hover:scale-105"
              >
                <div className="rounded-lg overflow-hidden bg-transparent shadow-md hover:shadow-yellow-500">
                  <div className="aspect-[2/3] bg-black">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-transparent">
                    <h3 className="text-white text-sm text-center font-medium truncate">
                      {actor.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorsList;
