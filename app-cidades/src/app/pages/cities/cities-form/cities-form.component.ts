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
import City from '../city';
import Country from '@pages/countries/country';

@Component({
  selector: 'app-cities-form',
  templateUrl: './cities-form.component.html',
  styleUrl: './cities-form.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class CitiesFormComponent {
  readonly dialogRef = inject(MatDialogRef<CitiesFormComponent>);
  readonly data = inject<{ city: City; countries: Country[] }>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);

  citiesForm = this.fb.group({
    id: [{ value: this.data?.city?.id, disabled: true }],
    name: [this.data?.city?.name, Validators.required],
    population: [this.data?.city?.population, Validators.min(0)],
    latitude: [this.data?.city?.latitude],
    longitude: [this.data?.city?.longitude],
    countryId: [this.data?.city?.countryId],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.citiesForm.valid) {
      this.dialogRef.close(this.citiesForm.getRawValue());
    }
  }
}
