import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Movie} from "../types/movie.types";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb(): { movies: Movie[] } {
    const movies: Movie[] = [
      {id: 1, title: 'The Shawshank Redemption', year: 1994},
      {id: 2, title: 'The Godfather', year: 1972},
      {id: 3, title: 'The Dark Knight', year: 2008},
      {id: 4, title: 'Pulp Fiction', year: 1994},
      {id: 5, title: 'Forrest Gump', year: 1994},
    ];
    return {movies};
  }
}
