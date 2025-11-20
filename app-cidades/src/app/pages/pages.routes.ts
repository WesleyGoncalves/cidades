import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'countries',
    pathMatch: 'full',
  },
  {
    path: 'continents',
    loadChildren: () =>
      import('@pages/continents/continents.routes').then((m) => m.routes),
  },
  {
    path: 'countries',
    loadChildren: () =>
      import('@pages/countries/countries.routes').then((m) => m.routes),
  },
  {
    path: 'cities',
    loadChildren: () =>
      import('@pages/cities/cities.routes').then((m) => m.routes),
  },
];
