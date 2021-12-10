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
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.auth.currentUserValue) {
        console.log(this.auth.currentUserValue);
        this.router.navigate(['login']);
        return false;
      }
      return true;
  }
}
