'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineFileDownload } from 'react-icons/md';

export default function EditMovie() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  const userId = 'dummyUserId'; // Replace this with the actual user ID or fetch from session

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store actual file
      setPreview(URL.createObjectURL(file)); // For preview
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Programmatically trigger the file input when clicking on the box
  const handleBoxClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !year || !image) {
      setError('All fields are required');
      return;
    }

    const newMovie = {
      movieName: title,
      releaseYear: year,
      image,
      userId,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/movies/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) throw new Error('Failed to add movie');

      // Redirect to movies list upon successful API response
      router.push('/movies');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen  bg-[#093545]  flex justify-center p-4 ">
      <div className=" text-white flex flex-col items-center pt-12 w-full max-w-[1000px] ">
        <div className="w-full text-left ">
        <h1 className="md:text-[40px] text-[20px] font-Montserrat font-normal  text-start ">
            Create a new movie
          </h1>
        </div>

        <div className=" text-white flex flex-col items-center md:mt-16 w-full mt-5 ">
          <div className=" w-full flex flex-col md:flex-row-reverse items-start justify-between gap-12 ">
            <div className="w-full flex-1 ">
              {error && <p className="text-red-500">{error}</p>}
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 pl-4 bg-[#16384c] rounded-md border-none text-white font-Montserrat "
                  required
                />
                <input
                  type="text"
                  placeholder="Publishing year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
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
                    className="px-12 py-3 bg-[#2BD17E] rounded-md font-Montserrat hover:bg-[#28c76f] transition"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full flex-1  flex items-center justify-start">
              <div
                className="w-[400px] h-[300px] bg-[#224957] md:h-[400px] border-dashed border-2 border-gray-400 flex items-center justify-center rounded-lg cursor-pointer"
                onDrop={handleImageDrop}
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
                className="px-8 py-3 bg-[#2BD17E] rounded-md font-Montserrat hover:bg-[#28c76f] transition"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
