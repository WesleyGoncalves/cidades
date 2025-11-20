import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import Country from '../country';
import Continent from '@pages/continents/continent';

@Component({
  selector: 'app-countries-form',
  templateUrl: './countries-form.component.html',
  styleUrl: './countries-form.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CountriesFormComponent {
  readonly dialogRef = inject(MatDialogRef<CountriesFormComponent>);
  readonly data = inject<{ country: Country; continents: Continent[] }>(
    MAT_DIALOG_DATA
  );

  private fb = inject(FormBuilder);

  countriesForm = this.fb.group({
    id: [{ value: this.data?.country?.id, disabled: true }],
    name: [this.data?.country?.name, Validators.required],
    description: [this.data?.country?.description],

    population: [this.data?.country?.population, Validators.min(0)],
    officialLanguage: [this.data?.country?.officialLanguage],
    currency: [this.data?.country?.currency],
    continentId: [this.data?.country?.continentId],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.countriesForm.valid) {
      this.dialogRef.close(this.countriesForm.getRawValue());
    }
  }
}
