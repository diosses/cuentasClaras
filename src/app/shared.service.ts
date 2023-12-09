import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  showSidenav: boolean = true;

  constructor(private router: Router) {}

  shouldShowSidenav(): boolean {
    const excludedUrls = ['/login',];
  
    return !excludedUrls.some(url => this.router.url.includes(url));
  }
}

