// movie.types.ts
export interface Movie {
  id?: number;
  title: string;
  year: number;
}

export interface MoviesState {
  movies: Movie[];
  filteredMovies: Movie[];
  searchQuery: string;
  sortBy: 'title' | 'year' | null;
}
