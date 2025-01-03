import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
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
  const [userEmail, setUserEmail] = useState(null);
  const moviesPerPage = 8;

  useEffect(() => {
    const email = localStorage.getItem('userEmail'); // Replace 'userEmail' with your actual key
    if (email) {
      setUserEmail(email);
      fetchMovies(email); // Fetch movies based on email
    } else {
      setError('User email not found in local storage.');
    }
  }, []);

  const router = useRouter();
 // Ensure fetchMovies gets email directly from localStorage if undefined
const fetchMovies = async (email) => {
  setLoading(true);
  try {
    const userEmailToUse = email || localStorage.getItem('userEmail'); // Fallback to fetch from localStorage
    if (!userEmailToUse) {
      setError('User email not found.');
      return;
    }

    const response = await fetch(`/api/movies/get?userEmail=${userEmailToUse}`);
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
        body: JSON.stringify({ ...newMovie, userEmail }),
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

  const handleDeleteMovie = async (movieId, userId) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;
  
    setLoading(true);
    try {
      const response = await fetch('/api/movies/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userId }),  // Send both movieId and userId
      });
  
      if (!response.ok) throw new Error('Failed to delete movie');
      await fetchMovies();  // Refresh the movie list after deletion
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
    if (userEmail) {
      fetchMovies(userEmail);
    }
  }, [userEmail]);
  const handleLogout = () => {
    // Clear user session from localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');  // If you store a token, clear it too

    // Redirect to sign-in page
    router.push('/signin');
  }

  const handleRedirect = () => {
    router.push('/createmovie');  // Redirect to the create movie page
  };
  return (
    <div className="w-full min-h-screen  bg-[#093545]  flex justify-center p-4 ">
    <div className=" text-white">
      {movies.length > 0 && (
        <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="md:text-[35px] text-[14px] font-montserrat">My movies</h1>
          <IoIosAddCircleOutline onClick={handleRedirect} size={32} className="cursor-pointer text-white" />
        </div>
      
        {/* Logout Button with Icon */}
        <div  onClick={handleLogout} className="px-6 py-2 rounded-md transition flex items-center gap-2 cursor-pointer">
          <span>Logout</span>
          <MdOutlineLogout size={20} />
        </div>
      </header>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {movies.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="md:text-[48px] font-semibold text-[18px] font-Montserrat mb-6">
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
                className="overflow-hidden bg-[#16384c] rounded-lg shadow-md relative"
              >
                <img
                  src={movie.imagePath}
                  alt={movie.movieName}
                  className="md:h-[300px] h-[200px]  w-[200px] object-cover"
                />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{movie.movieName}</h2>
                    <p className="text-sm text-gray-300">{movie.releaseYear}</p>
                  </div>
                  <div className="flex space-x-4">
                    <FaEdit
                      className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                      size={20}
                      onClick={() => router.push(`/editmovie?id=${movie._id}`)}
                    />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                      size={20}
                      onClick={() => handleDeleteMovie(movie._id, userEmail)}
                    />
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
    </div>
  );
}
