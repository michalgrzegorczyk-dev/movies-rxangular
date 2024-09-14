import {Movie} from "./movie.types";
import {SortBy} from "./movie-sort-by.type";

export type MovieStateType = {
  movies: Movie[];
  sortBy: SortBy;
  selectedMovie: Movie | null;
  filteredMovies: Movie[];
}
