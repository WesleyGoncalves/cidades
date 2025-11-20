import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import Continent from './continent';

@Injectable()
export class ContinentsService {
  private _continents$ = signal<Continent[]>([]);
  continents$ = this._continents$.asReadonly();

  private http = inject(HttpClient);

  constructor() {}

  /**
   * Get all continents.
   * @returns
   */
  public get(): void {
    this.http.get<Continent[]>(`${environment.apiUrl}/continents`).subscribe({
      next: (data: Continent[]) => {
        this._continents$.set(data);
      },
      error: (error) => {
        this._continents$.set([]);
        // console.error('Error fetching continents:', error);
      },
    });
  }

  /**
   * Find a continent by ID.
   * @returns
   */
  public getOne(id: number): Continent | undefined {
    const continent = this._continents$().find((cont) => cont.id === id);
    if (continent) {
      return continent;
    }

    this.http
      .get<Continent>(`${environment.apiUrl}/continents/${id}`)
      .subscribe({
        next: (data: Continent) => {
          const currentContinents = this._continents$();
          const index = currentContinents.findIndex(
            (cont) => cont.id === data.id
          );
          if (index !== -1) {
            currentContinents[index] = data;
            this._continents$.set([...currentContinents]);
          } else {
            this._continents$.set([...currentContinents, data]);
          }
        },
        error: (error) => {
          console.error(`Error fetching continent with ID ${id}:`, error);
        },
      });

    return this._continents$().find((continent) => continent.id === id);
  }

  /**
   * Add a continent
   * @param continent
   */
  public add(continent: Omit<Continent, 'id'>): void {
    this.http
      .post<Continent>(`${environment.apiUrl}/continents`, continent)
      .subscribe({
        next: (data: Continent) => {
          this._continents$.update((continents: Continent[]) => [
            ...continents,
            data,
          ]);
        },
        error: (error) => {
          console.error('Error adding continent:', error);
        },
      });
  }

  /**
   * Update a continent.
   * @param continent
   */
  public update(continent: Continent): void {
    this.http
      .put<void>(`${environment.apiUrl}/continents`, continent)
      .subscribe({
        next: () => {
          this._continents$.update((conts: Continent[]) => {
            let filteredConts = conts.filter(
              (cont: Continent) => cont.id !== continent.id
            );

            return [...filteredConts, continent];
          });
        },
        error: (error) => {
          console.error('Error updating continent:', error);
        },
      });
  }

  /**
   * Delete a continent.
   * @param id
   */
  public delete(id: number): void {
    this.http.delete<void>(`${environment.apiUrl}/continents/${id}`).subscribe({
      next: () => {
        this._continents$.update((conts: Continent[]) =>
          conts.filter((cont: Continent) => cont.id !== id)
        );
      },
      error: (error) => {
        console.error('Error deleting continent:', error);
      },
    });
  }

  /**
   * Filter by name.
   * @param searchText
   * @returns
   */
  public filter(searchText: string): Continent[] {
    return this._continents$().filter((continent) =>
      continent.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
