import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = `${this.config.apiUrl}login`;
  logoutUrl = `${this.config.apiUrl}logout`;
  currentUserSubject$: BehaviorSubject<User | null> = new BehaviorSubject(null);
  lastToken: string = '';
  currentUserValue: User | undefined;

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private router: Router,
  ) {
    if (localStorage.currentUser) {
      const user: User = JSON.parse(localStorage.currentUser);
      this.currentUserValue = user; 
      this.lastToken = (user) as string || '';
      this.currentUserSubject$.next(user);
    }
  }

  login(loginData: User): Observable<User | null> {
    return this.http.post<{ user: User, accessToken: string }>(
      this.loginUrl,
      loginData
    ).pipe(
      map(response => {
        if (response.user && response.accessToken) {
          this.lastToken = response.accessToken;
          response.user.accessToken = response.accessToken;
          this.currentUserSubject$.next(response.user);
          localStorage.currentUser = JSON.stringify(response.user.accessToken);
          this.currentUserValue = response.user;
          console.log(this.lastToken);
          return response.user;
        }
        return null;
      })
    )
  }

  logout(): void {
    this.lastToken = '';
    this.currentUserSubject$.next(null);
    localStorage.removeItem('currentUser');
    this.currentUserValue = undefined;
    this.router.navigate(['/', 'login']);
  }
}
