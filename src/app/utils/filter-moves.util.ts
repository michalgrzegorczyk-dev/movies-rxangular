import {Movie} from "../types/movie.types";

export function filterMovies(movies: Movie[], search: string): Movie[] {
  return movies.filter((movie: Movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );
}
