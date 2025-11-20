import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-full',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss',
})
export class FullComponent {
  private breakpointObserver = inject(BreakpointObserver);
  isDarkTheme = document.body.getAttribute('color-mode') === 'dark';

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const body = document.body;
    if (this.isDarkTheme) {
      body.setAttribute('color-mode', 'dark');
    } else {
      body.setAttribute('color-mode', 'light');
    }
  }
}
