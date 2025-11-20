import { Component, effect, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CountriesService } from '@pages/countries/countries.service';
import { CitiesFormComponent } from '../cities-form/cities-form.component';
import { CitiesService } from '../cities.service';
import City from '../city';

@Component({
  selector: 'app-cities-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatTooltipModule,
    DecimalPipe,
  ],
  providers: [CountriesService],
  templateUrl: './cities-list.component.html',
  styleUrl: './cities-list.component.scss',
})
export class CitiesListComponent implements OnInit {
  protected readonly citiesService = inject(CitiesService);
  protected readonly countriesService = inject(CountriesService);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.citiesService.get();
    this.countriesService.get();
  }

  openDialog(city: City | null = null): void {
    const dialogRef = this.dialog.open(CitiesFormComponent, {
      data: {
        city: city,
        countries: this.countriesService.countries$(),
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((city: City | Omit<City, 'id'> | undefined) => {
        if (city !== undefined) {
          console.log(city);

          if (Object.hasOwn(city, 'id') && (city as City).id !== undefined) {
            this.citiesService.update(city as City);
          } else {
            this.citiesService.add(city);
          }
        }
      });
  }
}
