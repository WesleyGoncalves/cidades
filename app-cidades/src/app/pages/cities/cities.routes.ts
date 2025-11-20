import { Routes } from '@angular/router';
import { CitiesService } from './cities.service';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  {
    path: '',
    providers: [CitiesService, provideHttpClient()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./cities-list/cities-list.component').then(
            (m) => m.CitiesListComponent
          ),
      },
    ],
  },
];
