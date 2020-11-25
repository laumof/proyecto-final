import { Component, OnInit } from '@angular/core';
import { PetsService } from './services/pets.service';
import { PetItem } from './models/pet';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddPetComponent } from './components/add-pet/add-pet.component';
import { OverlayContainer } from '@angular/cdk/overlay';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pets: PetItem[];
  displayedColumns: string[] = ['admissionDate', 'owner', 'species', 'name', 'description', 'doctor', 'departureDate', 'cost'];
  dataSource = new MatTableDataSource();
  constructor(public petsService: PetsService, public dialog: MatDialog, public overlayContainer: OverlayContainer) {}

  ngOnInit(): void {
    this.petsService.getPets().subscribe(data => {
      this.pets = data;
      this.dataSource = new MatTableDataSource(this.pets);
    });
    this.overlayContainer.getContainerElement().classList.add('overlay-theme');
    this.overlayContainer.getContainerElement().classList.add('teal');
  }


  addpet(): void {
    const dialogRef = this.dialog.open(AddPetComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.petsService.getPets().subscribe(data => {
            this.pets = data;
            this.dataSource = new MatTableDataSource(this.pets);
          });
        }
      }
    });
  }
}
