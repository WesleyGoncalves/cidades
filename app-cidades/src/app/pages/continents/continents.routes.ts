import { Routes } from '@angular/router';
import { ContinentsService } from './continents.service';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  {
    path: '',
    providers: [ContinentsService, provideHttpClient()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./continents-list/continents-list.component').then(
            (m) => m.ContinentsListComponent
          ),
      },
    ],
  },
];
