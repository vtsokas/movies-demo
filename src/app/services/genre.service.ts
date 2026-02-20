// src/app/todos/data-access/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenreResponse } from '../models/genre.model';

@Injectable({ providedIn: 'root' })
export class GenreService {
    // MovieDB api url for genres
    private API_URL = environment.apiUrl + '/genre/movie/list'; 

    // Inject http 
    constructor(private http: HttpClient) { }

    // Return observable of GenreResponse
    getGenres(): Observable<GenreResponse> {
        return this.http.get<GenreResponse>(this.API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            }
        });
    }
}
