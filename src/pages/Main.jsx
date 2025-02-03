import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import MovieResults from "../components/MovieResults";
import axios from "axios";
import Loading from "../components/Loading";

const Main = ({ addToFavourites, favourites, removeMovie }) => {
  const [movieList, setMovieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('DEFAULT');

  async function fetchMovies(search = '') {
    setLoading(true);
    try {
      const { data } = await axios.get(
        search
          ? `https://api.themoviedb.org/3/search/movie?api_key=09dc28db888e1d72ae7b845dad32eb2c&query=${search}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=09dc28db888e1d72ae7b845dad32eb2c`
      );

      const filteredMovies = data.results.filter(
        (movie) => movie && movie.title && movie.poster_path && movie.release_date
      ).map(movie => ({ ...movie, Year: new Date(movie.release_date).getFullYear() }));

      setMovieList(filteredMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterMovies(movies, filter) {
    let filteredMovies = [...movies];
    if (filter === 'OLD_TO_NEW') {
      filteredMovies.sort((a, b) => a.Year - b.Year);
    } else if (filter === 'NEW_TO_OLD') {
      filteredMovies.sort((a, b) => b.Year - a.Year);
    }
    return filteredMovies;
  }

  useEffect(() => {
    fetchMovies(); 
  }, []);

  function handleSearch(event) {
    if (event) event.preventDefault(); 
    fetchMovies(searchTerm); 
  }

  useEffect(() => {
    const sortedMovies = filterMovies(movieList, filter);
    setMovieList(sortedMovies);
  }, [filter]);

  function handleAddToFavourites(movie) {
    if (!favourites.some(favMovie => favMovie.id === movie.id)) {
      addToFavourites(movie);
    }
  }

  return (
    <>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} 
        onSearch={handleSearch} 
      />
      <div className="filter__header">
        <div className="filters">
          <select
            className="filter"
            id="movieFilter"
            value={filter} 
            onChange={(event) => {
              setFilter(event.target.value); 
            }}
          >
            <option className="filter__content" value="DEFAULT" disabled>Sort</option>
            <option className="filter__content" value="OLD_TO_NEW">Oldest</option>
            <option className="filter__content" value="NEW_TO_OLD">Newest</option>
          </select>
        </div>
      </div>
      {loading ? 
        <Loading /> : 
        <MovieResults movies={movieList} addToFavourites={addToFavourites} favourites={favourites} removeMovie={removeMovie}/>
      }
    </>
  );
};

export default Main;
