import {Movie} from "../types/movie.types";
import {SortBy} from "../types/movie-sort-by.type";

export function sortMovies(movies: Movie[], sortBy: SortBy): Movie[] {
  return [...movies].sort((a: Movie, b: Movie): number => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'year') {
      return a.year - b.year;
    }
    return 0;
  });
}
