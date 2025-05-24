import { Link } from 'react-router-dom';

const TVList = () => {
  // Fetch popular TV shows here
  const shows = [
    { id: 66732, name: 'Vikings' },
    { id: 1396, name: 'Breaking Bad' }
  ];

  return (
    <div className="tv-list">
      <h1>Popular TV Shows</h1>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            <Link to={`/tv/${show.id}`}>{show.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};