'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineFileDownload } from 'react-icons/md';

export default function EditMovie() {
  const [editingMovie, setEditingMovie] = useState({
    movieName: '',
    releaseYear: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('id'); // Get movieId from URL
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';

  // Fetch movie by email when the component mounts
  useEffect(() => {
    const fetchMovieById = async () => {
      if (!movieId) {
        setError('Movie ID not found in URL.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/movies/getbyid?id=${movieId}`);
        if (!response.ok) throw new Error('Failed to fetch movie details');
  
        const movieData = await response.json();
        setEditingMovie({
          movieId: movieData._id,
          movieName: movieData.movieName,
          releaseYear: movieData.releaseYear,
          image: movieData.imagePath,
        });
        setPreview(movieData.imagePath);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovieById();
  }, [movieId]);
  
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingMovie((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!editingMovie.movieName || !editingMovie.releaseYear || !editingMovie.image) {
      setError('All fields are required');
      return;
    }
  
    if (!editingMovie.movieId) {
      setError('Movie ID is missing. Please try again.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('/api/movies/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingMovie,
          userEmail,  // Send the user email for validation
        }),
      });
  
      if (!response.ok) throw new Error('Failed to update movie');
  
      router.push('/movies');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBoxClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="w-full min-h-screen  bg-[#093545]  flex justify-center p-4 ">
      <div className=" text-white flex flex-col items-center pt-12 w-full max-w-[1000px] ">
      <div className="w-full text-left ">
          <h1 className="md:text-[40px] text-[20px font-Montserrat font-normal  text-start ">Edit</h1>
      </div>

        <div className=" text-white flex flex-col items-center md:mt-16 w-full mt-5 ">
          <div className=" w-full flex flex-col md:flex-row-reverse items-start justify-between gap-12 ">
            <div className="w-full flex-1 ">
            {error && <p className="text-red-500">{error}</p>}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <input
                 type="text"
                 name="movieName"
                 placeholder="Title"
                 value={editingMovie.movieName}
                 onChange={handleInputChange}
                  className="w-full p-2 pl-4 bg-[#16384c] rounded-md border-none text-white font-Montserrat "
                required
              />
              <input
                 type="text"
                 name="releaseYear"
                 placeholder="Publishing year"
                 value={editingMovie.releaseYear}
                 onChange={handleInputChange}
                  className="w-full md:w-[250px] p-2 pl-4 bg-[#16384c] rounded-md border-none text-white font-Montserrat focus:outline-none"
                required
              />
                <div className=" gap-6 hidden md:flex mt-5">
                <button
                  type="button"
                  onClick={() => router.push('/movies')}
                    className="px-12 py-3 border font-Montserrat border-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                    className="px-12 py-3 bg-[#2BD17E] rounded-md font-Montserrat  transition"
                  disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>

            <div className="w-full flex-1  flex items-center justify-start">
            <div
                className="w-[400px] h-[300px] bg-[#224957] md:h-[400px] border-dashed border-2 border-gray-400 flex items-center justify-center rounded-lg cursor-pointer"
                // onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleBoxClick}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                  <div className="text-center flex flex-col items-center justify-center">
                    <MdOutlineFileDownload className="w-8 h-8" />
                    <p className="text-[14px] font-Montserrat">
                      Click or Drop an image here
                    </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleFileSelect}
            />
            </div>
          </div>
          <div className="items-center justify-center flex mt-5">
            <div className="flex gap-6  md:hidden justify-center">
              <button
                type="button"
                onClick={() => router.push('/movies')}
                className="px-8 py-3 border font-Montserrat border-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#2BD17E] rounded-md font-Montserrat hover:bg-[#28c76f] transition"
                disabled={loading}
              >
                 {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
