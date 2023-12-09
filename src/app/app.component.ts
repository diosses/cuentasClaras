import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private sharedService: SharedService) {}

  get showSidenav(): boolean {
    return this.sharedService.shouldShowSidenav();
  }

  toggleSidenav(): void {
    this.sharedService.showSidenav = !this.sharedService.showSidenav;
  }
}
