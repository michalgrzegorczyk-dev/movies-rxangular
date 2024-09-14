import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Movie} from "../types/movie.types";

const MOVIE_URL = 'api/movies';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private readonly httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private readonly http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(MOVIE_URL);
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(MOVIE_URL, movie, this.httpOptions);
  }

  deleteMovie(id: number): Observable<Movie> {
    return this.http.delete<Movie>(`${MOVIE_URL}/${id}`, this.httpOptions);
  }

  updateMovie(movie: Movie): Observable<any> {
    return this.http.put(MOVIE_URL, movie, this.httpOptions);
  }
}
