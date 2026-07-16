import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';
  private storageKey = 'ford_user';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<User> {
    const body: LoginRequest = {
      user_name: userName,
      user_password: password
    };

    return this.http.post<User>(`${this.apiUrl}/login`, body).pipe(
      tap((user) => {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
}