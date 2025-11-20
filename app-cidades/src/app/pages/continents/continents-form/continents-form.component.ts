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
import Continent from '@pages/continents/continent';

@Component({
  selector: 'app-continents-form',
  templateUrl: './continents-form.component.html',
  styleUrl: './continents-form.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class ContinentsFormComponent {
  readonly dialogRef = inject(MatDialogRef<ContinentsFormComponent>);
  readonly data = inject<Continent>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);

  continentsForm = this.fb.group({
    id: [{ value: this.data?.id, disabled: true }],
    name: [this.data?.name, Validators.required],
    description: [this.data?.description],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.continentsForm.valid) {
      this.dialogRef.close(this.continentsForm.getRawValue());
    }
  }
}
