import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  type MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  type MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-chips',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
})
export class FilterChipsComponent {
  readonly list = input<string[]>([]);
  readonly placeholder = input<string>('Filter...');

  change = output<string[]>();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly current = model('');
  readonly data = signal<string[]>([]);

  readonly filteredData = computed(() => {
    const current = this.current().toLowerCase();
    return current
      ? this.list().filter((entry) => entry.toLowerCase().includes(current))
      : this.list().slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our entry
    if (value) {
      this.data.update((data) => [...data, value]);
    }

    this.current.set('');
  }

  remove(entry: string): void {
    this.data.update((data) => {
      const index = data.indexOf(entry);
      if (index < 0) {
        return data;
      }

      data.splice(index, 1);
      this.announcer.announce(`Removed ${entry}`);
      this.change.emit(data);
      return [...data];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.data.update((data) => [...data, event.option.viewValue]);
    this.current.set('');
    event.option.deselect();
    this.change.emit(this.data());
  }
}
