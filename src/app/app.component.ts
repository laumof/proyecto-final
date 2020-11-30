import { Component, OnInit } from '@angular/core';
import { PetsService } from './services/pets.service';
import { PetItem } from './models/pet';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddPetComponent } from './components/add-pet/add-pet.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
interface Response {
  pets: PetItem[];
}
const GET_TASKS = gql`
  query {
    allPacientes {
      edges{
        node {
          id,
          name,
          size,
          species,
          race,
          age,
          color,
          situation,
          description,
          owner,
          phone1,
          phone2,
          dpi,
          address,
          admissionDate,
          doctor,
          departureDate,
          cost
        }
      }
    }
  }
`;

const ADD_PET = gql`
  mutation AddPaciente {
    insert_paciente(objects: {
      id: "",
      name: "",
      size: "",
      species: "",
      race: "",
      age: "",
      color: "",
      situation: "",
      description: "",
      owner: "",
      phone1: "",
      phone2: "",
      dpi: "",
      address: "",
      admissionDate: "",
      doctor: "",
      departureDate: "",
      cost: ""
    })
    returning {
      id,
      name,
      size,
      species,
      race,
      age,
      color,
      situation,
      description,
      owner,
      phone1,
      phone2,
      dpi,
      address,
      admissionDate,
      doctor,
      departureDate,
      cost
    }
  }
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pets: PetItem[];
  displayedColumns: string[] = ['admissionDate', 'owner', 'species', 'name', 'description', 'doctor', 'departureDate', 'cost'];
  dataSource = new MatTableDataSource();
  queryRef: QueryRef<Response>;
  pets$: Observable<PetItem[]>;
  constructor(public petsService: PetsService, public dialog: MatDialog, public overlayContainer: OverlayContainer, private apollo: Apollo) {}

  ngOnInit(): void {
    this.queryRef = this.apollo.watchQuery<Response>({
      query: GET_TASKS
    });
    this.pets$ = this.queryRef.valueChanges.pipe(
      map(result => {
        this.pets = result.data.pets;
        this.dataSource = new MatTableDataSource(this.pets);
        return result.data.pets;
      })
    );
    // this.petsService.getPets().subscribe(data => {
    //   this.pets = data;
    //   this.dataSource = new MatTableDataSource(this.pets);
    // });
    // this.overlayContainer.getContainerElement().classList.add('overlay-theme');
    // this.overlayContainer.getContainerElement().classList.add('teal');
  }


  addpet(): void {
    const dialogRef = this.dialog.open(AddPetComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.apollo.mutate({
          mutation: ADD_PET,
          variables: result
        }).subscribe(({ data }) => {
          this.queryRef.refetch();
          alert('Mascota agregada');
        }, err => {
          alert('Hubo un error al guardar el ingreso, intente de nuevo más tarde');

        });
        // if (result === true) {
        //   this.petsService.getPets().subscribe(data => {
        //     this.pets = data;
        //     this.dataSource = new MatTableDataSource(this.pets);
        //   });
        // }
      }
    });
  }
}
