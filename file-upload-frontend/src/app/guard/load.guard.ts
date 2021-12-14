import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoadGuard implements CanLoad {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  
  canLoad(
    _route: Route,
    _segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.auth.currentUserValue) {
        return this.router.parseUrl('login');
      }
      return true;
  }
}
