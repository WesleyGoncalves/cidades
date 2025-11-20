import { Component, effect, inject, OnInit } from '@angular/core';
import { ContinentsService } from '../continents.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import Continent from '../continent';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ContinentsFormComponent } from '../continents-form/continents-form.component';

@Component({
  selector: 'app-continents-list',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './continents-list.component.html',
  styleUrl: './continents-list.component.scss',
})
export class ContinentsListComponent implements OnInit {
  protected continentsService = inject(ContinentsService);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.continentsService.get();
  }

  openDialog(continent: Continent | null = null): void {
    const dialogRef = this.dialog.open(ContinentsFormComponent, {
      data: continent,
    });

    dialogRef
      .afterClosed()
      .subscribe((continent: Continent | Omit<Continent, 'id'> | undefined) => {
        if (continent !== undefined) {
          console.log(continent);

          if (
            Object.hasOwn(continent, 'id') &&
            (continent as Continent).id !== undefined
          ) {
            this.continentsService.update(continent as Continent);
          } else {
            this.continentsService.add(continent);
          }
        }
      });
  }
}
