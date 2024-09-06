import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Movie } from "./movie.types";

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private movies: Movie[] = [
    {id: 1, title: 'Inception', year: 2010},
    {id: 2, title: 'The Matrix', year: 1999},
    {id: 3, title: 'Interstellar', year: 2014},
    {id: 4, title: 'The Shawshank Redemption', year: 1994},
    {id: 5, title: 'Pulp Fiction', year: 1994},
  ];

  getMovies(): Observable<Movie[]> {
    return of(this.movies).pipe(
      delay(1000),
      map(movies => {
        if (Math.random() < 0.1) {
          throw new Error('Random error occurred');
        }
        return movies;
      }),
      catchError(this.handleError)
    );
  }

  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    const newMovie = {
      ...movie,
      id: Math.max(...this.movies.map(m => {
        if (m.id) {
          return m.id
        }
        return 0;
      })) + 1
    };
    this.movies.push(newMovie);
    return of(newMovie).pipe(delay(500));
  }

  updateMovie(movie: Movie): Observable<Movie> {
    const index = this.movies.findIndex(m => m.id === movie.id);
    if (index !== -1) {
      this.movies[index] = movie;
      return of(movie).pipe(delay(500));
    }
    return throwError(() => new Error('Movie not found'));
  }

  deleteMovie(id: number): Observable<void> {
    const index = this.movies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    return throwError(() => new Error('Movie not found'));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
