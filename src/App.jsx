import { useEffect, useState } from "react";

import MovieCard from "./MovieCard";

import "./App.css";
import SearchIcon from "./search.svg";

const API_URL = import.meta.env.VITE_REACT_APP_MOVIES_API_URL;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchMovies = async (title) => {
    try {
      const url = `${API_URL}&s=${title}`;
      const response = await fetch(url);

      if (!response.ok) {
        // Handle HTTP errors (4xx or 5xx status codes)
        const errorText = await response.text(); // Get the error body (might be HTML)
        throw new Error(`HTTP error ${response.status}: ${errorText}`); // Throw an error with details
      }

      const data = await response.json();

      if (data.Response === "False") {
        // Check for API-specific errors (e.g., movie not found)
        console.log(data.Error); // Log the error message from the API
        setMovies([]); // Clear the movie list or display a "no results" message
        return; // Stop further execution
      }

      setMovies(data.Search || []); // Set movies, or an empty array if data.Search is undefined/null
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Handle the error in the UI, e.g., display an error message to the user.
      // Example: alert("Error searching movies. Please try again later.");
      setMovies([]); // Clear the movie list to avoid displaying old results.
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchMovies(searchTerm);
    }
  };

  useEffect(() => {
    searchMovies("Kill Bill");
  }, []);

  return (
    <div className="app">
      <h1>Incredible MovieLand</h1>
      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No Movies Found!</h2>
        </div>
      )}
    </div>
  );
};

export default App;
