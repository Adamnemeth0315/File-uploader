import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  list$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([])

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  getAll(): void {
    this.http.get<User[]>(`${this.config.apiUrl}users`).subscribe(
      list => {
        this.list$.next(list)
      },
      err => console.error(err)
    )
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(`${this.config.apiUrl}register`, user)
    .pipe(tap((e) => this.getAll()))
  }
}
