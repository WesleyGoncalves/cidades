import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import Country from './country';

@Injectable()
export class CountriesService {
  private _countries$ = signal<Country[]>([]);
  countries$ = this._countries$.asReadonly();

  private http = inject(HttpClient);

  constructor() {}

  /**
   * Get all countries.
   * @returns
   */
  public get(): void {
    this.http.get<Country[]>(`${environment.apiUrl}/countries`).subscribe({
      next: (data: Country[]) => {
        this._countries$.set(data);
      },
      error: (error) => {
        this._countries$.set([]);
        // console.error('Error fetching countries:', error);
      },
    });
  }

  /**
   * Find a country by ID.
   * @returns
   */
  public getOne(id: number): Country | undefined {
    const country = this._countries$().find((cont) => cont.id === id);
    if (country) {
      return country;
    }

    this.http.get<Country>(`${environment.apiUrl}/countries/${id}`).subscribe({
      next: (data: Country) => {
        const currentCountries = this._countries$();
        const index = currentCountries.findIndex((cont) => cont.id === data.id);
        if (index !== -1) {
          currentCountries[index] = data;
          this._countries$.set([...currentCountries]);
        } else {
          this._countries$.set([...currentCountries, data]);
        }
      },
      error: (error) => {
        console.error(`Error fetching country with ID ${id}:`, error);
      },
    });

    return this._countries$().find((country) => country.id === id);
  }

  /**
   * Add a country
   * @param country
   */
  public add(country: Omit<Country, 'id'>): void {
    this.http
      .post<Country>(`${environment.apiUrl}/countries`, country)
      .subscribe({
        next: (data: Country) => {
          this._countries$.update((countries: Country[]) => [
            ...countries,
            data,
          ]);
        },
        error: (error) => {
          console.error('Error adding country:', error);
        },
      });
  }

  /**
   * Update a country.
   * @param country
   */
  public update(country: Country): void {
    this.http.put<void>(`${environment.apiUrl}/countries`, country).subscribe({
      next: () => {
        this._countries$.update((conts: Country[]) => {
          let filteredConts = conts.filter(
            (cont: Country) => cont.id !== country.id
          );

          return [...filteredConts, country];
        });
      },
      error: (error) => {
        console.error('Error updating country:', error);
      },
    });
  }

  /**
   * Delete a country.
   * @param id
   */
  public delete(id: number): void {
    this.http.delete<void>(`${environment.apiUrl}/countries/${id}`).subscribe({
      next: () => {
        this._countries$.update((conts: Country[]) =>
          conts.filter((cont: Country) => cont.id !== id)
        );
      },
      error: (error) => {
        console.error('Error deleting country:', error);
      },
    });
  }

  /**
   * Filter by name.
   * @param searchText
   * @returns
   */
  public filter(searchText: string): Country[] {
    return this._countries$().filter((country) =>
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
