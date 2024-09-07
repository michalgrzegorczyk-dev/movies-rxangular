import {Movie} from "./movie.types";
import {SortBy} from "./sorty-by.type";

export interface MovieStateType {
  movies: Movie[];
  sortBy: SortBy;
  selectedMovie: Movie | null;
  filteredMovies: Movie[];
}
