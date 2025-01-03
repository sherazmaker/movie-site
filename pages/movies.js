import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { MdOutlineLogout } from 'react-icons/md';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    image: '',
    movieName: '',
    releaseYear: '',
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  const userId = 'dummyUserId'; // Replace with actual user ID from session or auth
  const router = useRouter();
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/get?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNavigateToCreate = () => {
    router.push('/createmovie');
  };
  const handleAddMovie = async () => {
    if (!newMovie.image || !newMovie.movieName || !newMovie.releaseYear) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/movies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newMovie, userId }),
      });

      if (!response.ok) throw new Error('Failed to add movie');
      setNewMovie({ image: '', movieName: '', releaseYear: '' });
      await fetchMovies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/movies/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userId }),
      });

      if (!response.ok) throw new Error('Failed to delete movie');
      await fetchMovies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const selectedMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#093545] text-white">
      {movies.length > 0 && (
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold">My movies 🎬</h1>

          {/* Logout Button with Icon */}
          <div className="px-6 py-2 rounded-md transition flex items-center gap-2 cursor-pointer">
            <span>Logout</span>
            <MdOutlineLogout size={20} />
          </div>
        </header>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {movies.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="md:text-[48px] text-[18px] font-Montserrat mb-6">
            Your movie list is empty
          </h1>
          <button
            onClick={handleNavigateToCreate}
            className="bg-[#2BD17E] px-14 py-3 rounded-lg"
          >
            Add a new movie
          </button>
        </div>
      ) : (
        <div className="p-6 flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {selectedMovies.map((movie) => (
              <div
                key={movie._id}
                className="overflow-hidden bg-[#16384c] rounded-lg shadow-md"
              >
                <img
                  src={movie.image}
                  alt={movie.movieName}
                  className="h-[300px] w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{movie.movieName}</h2>
                  <p className="text-sm text-gray-300">{movie.releaseYear}</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setEditingMovie(movie)}
                      className="bg-yellow-500 hover:bg-yellow-600 font-Montserrat text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie._id)}
                      className="bg-red-500 hover:bg-red-600 font-Montserrat text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#1dd977] hover:bg-[#18c76f]'
            }`}
          >
            Prev
          </button>

          <div className="mx-4 flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center font-Montserrat justify-center rounded ${
                  currentPage === i + 1
                    ? 'bg-[#1dd977] text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md font-Montserrat ${
              currentPage === totalPages
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#1dd977] hover:bg-[#18c76f]'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
