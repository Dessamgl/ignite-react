import { useContext } from "react";

import { movieCatalogContext } from "../contexts/MovieCatalogContext";

import { MovieCard } from "./MovieCard";
import '../styles/content.scss';

export function Content() {
  const { selectedGenre, movies } = useContext(movieCatalogContext);
  console.log(movies);
  
  return (
    <div className="container">
    <header>
      <span className="category">Categoria:<span> {selectedGenre.title}</span></span>
    </header>

    <main>
      <div className="movies-list">
        {movies.map(movie => (
          <MovieCard 
            key={movie.Title} 
            title={movie.Title} 
            poster={movie.Poster} 
            runtime={movie.Runtime} 
            rating={movie.Ratings[0].Value} 
          />
        ))}
      </div>
    </main>
  </div>
  )
}