import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import City from './city';

@Injectable()
export class CitiesService {
  private _cities$ = signal<City[]>([]);
  cities$ = this._cities$.asReadonly();

  private http = inject(HttpClient);

  constructor() {}

  /**
   * Get all cities.
   * @returns
   */
  public get(): void {
    this.http.get<City[]>(`${environment.apiUrl}/cities`).subscribe({
      next: (data: City[]) => {
        this._cities$.set(data);
      },
      error: (error) => {
        this._cities$.set([]);
        // console.error('Error fetching cities:', error);
      },
    });
  }

  /**
   * Find a city by ID.
   * @returns
   */
  public getOne(id: number): City | undefined {
    const city = this._cities$().find((cont) => cont.id === id);
    if (city) {
      return city;
    }

    this.http.get<City>(`${environment.apiUrl}/cities/${id}`).subscribe({
      next: (data: City) => {
        const currentCities = this._cities$();
        const index = currentCities.findIndex((cont) => cont.id === data.id);
        if (index !== -1) {
          currentCities[index] = data;
          this._cities$.set([...currentCities]);
        } else {
          this._cities$.set([...currentCities, data]);
        }
      },
      error: (error) => {
        console.error(`Error fetching city with ID ${id}:`, error);
      },
    });

    return this._cities$().find((city) => city.id === id);
  }

  /**
   * Add a city
   * @param city
   */
  public add(city: Omit<City, 'id'>): void {
    this.http.post<City>(`${environment.apiUrl}/cities`, city).subscribe({
      next: (data: City) => {
        this._cities$.update((cities: City[]) => [...cities, data]);
      },
      error: (error) => {
        console.error('Error adding city:', error);
      },
    });
  }

  /**
   * Update a city.
   * @param city
   */
  public update(city: City): void {
    this.http.put<void>(`${environment.apiUrl}/cities`, city).subscribe({
      next: () => {
        this._cities$.update((conts: City[]) => {
          let filteredConts = conts.filter((cont: City) => cont.id !== city.id);

          return [...filteredConts, city];
        });
      },
      error: (error) => {
        console.error('Error updating city:', error);
      },
    });
  }

  /**
   * Delete a city.
   * @param id
   */
  public delete(id: number): void {
    this.http.delete<void>(`${environment.apiUrl}/cities/${id}`).subscribe({
      next: () => {
        this._cities$.update((conts: City[]) =>
          conts.filter((cont: City) => cont.id !== id)
        );
      },
      error: (error) => {
        console.error('Error deleting city:', error);
      },
    });
  }

  /**
   * Filter by name.
   * @param searchText
   * @returns
   */
  public filter(searchText: string): City[] {
    return this._cities$().filter((city) =>
      city.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
