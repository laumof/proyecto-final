import { Component, OnInit } from '@angular/core';
import { PetsService } from './services/pets.service';
import { PetItem } from './models/pet';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pets: PetItem[];
  displayedColumns: string[] = ['admissionDate', 'owner', 'species', 'name', 'description', 'doctor', 'departureDate', 'cost'];
  dataSource = new MatTableDataSource();
  constructor(public petsService: PetsService) {}

  ngOnInit(): void {
    this.petsService.getPets().subscribe(data => {
      this.pets = data;
      this.dataSource = new MatTableDataSource(this.pets);
    });
  }
}
