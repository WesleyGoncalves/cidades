import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ContinentsService } from '@pages/continents/continents.service';
import { CountriesFormComponent } from '../countries-form/countries-form.component';
import { CountriesService } from '../countries.service';
import Country from '../country';
import { FilterChipsComponent } from '@components/filter-chips/filter-chips.component';

@Component({
  selector: 'app-countries-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatTooltipModule,
    DecimalPipe,
    FilterChipsComponent,
  ],
  providers: [ContinentsService],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.scss',
})
export class CountriesListComponent implements OnInit {
  protected readonly countriesService = inject(CountriesService);
  protected readonly continentsService = inject(ContinentsService);
  readonly dialog = inject(MatDialog);

  protected continentNamesFilter = signal<string[]>([]);
  protected countries = signal<Country[]>([]);

  protected continentNames = computed(() =>
    this.continentsService.continents$().map((continent) => continent.name)
  );

  constructor() {
    // update countries when filter changes
    effect(() => {
      console.log('filtered continents names', this.continentNamesFilter());

      if (this.continentNamesFilter().length === 0) {
        this.countries.set(this.countriesService.countries$());
        return;
      }

      const filteredCountries = this.filterByContinents(
        this.continentNamesFilter()
      );
      this.countries.set(filteredCountries);
    });
  }

  ngOnInit(): void {
    this.countriesService.get();
    this.continentsService.get();
  }

  openDialog(country: Country | null = null): void {
    const dialogRef = this.dialog.open(CountriesFormComponent, {
      data: {
        country: country,
        continents: this.continentsService.continents$(),
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((country: Country | Omit<Country, 'id'> | undefined) => {
        if (country !== undefined) {
          console.log(country);

          if (
            Object.hasOwn(country, 'id') &&
            (country as Country).id !== undefined
          ) {
            this.countriesService.update(country as Country);
          } else {
            this.countriesService.add(country);
          }
        }
      });
  }

  onFilterChange(continentNames: string[]): void {
    console.log('continentNames', continentNames);
    this.continentNamesFilter.set(continentNames);
    console.log('filters: ', this.continentNamesFilter());
  }

  /**
   * Filter by continents.
   * @param continentNames
   * @returns
   */
  public filterByContinents(continentNames: string[]): Country[] {
    if (continentNames.length === 0) {
      return this.countriesService.countries$();
    }

    return this.countriesService.countries$().filter((country) => {
      const continent = this.continentsService.getOne(country.continentId);
      return continentNames.includes(continent?.name || '');
    });
  }
}
