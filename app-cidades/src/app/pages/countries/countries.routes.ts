import { Routes } from '@angular/router';
import { CountriesService } from './countries.service';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  {
    path: '',
    providers: [CountriesService, provideHttpClient()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./countries-list/countries-list.component').then(
            (m) => m.CountriesListComponent
          ),
      },
    ],
  },
];
