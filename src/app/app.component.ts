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
    pacientes {
      edges{
        node {
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
  mutation {
    pacienteCreate (input: {
      name: "Bonita",
      size: "big",
      species: "canine",
      race: "minipinscher",
      age: "13"
      color: "Black and brown"
      situation: "normal"
      description: "active"
      owner: "Laura Morales"
      phone1: "41511333"
      phone2: "41513787"
      dpi: "2356898874512"
      address: "Quetzaltenango"
      admissionDate: "01 dic"
      doctor: "Carrillo"
      departureDate: "02 dic"
      cost: "200"
    }){
          paciente {
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
  queryRef: QueryRef<any>;
  pets$: Observable<PetItem[]>;
  constructor(public petsService: PetsService, public dialog: MatDialog, public overlayContainer: OverlayContainer, private apollo: Apollo) {}

  ngOnInit(): void {
    this.queryRef = this.apollo.watchQuery<any>({
      query: GET_TASKS
    });
    this.pets$ = this.queryRef.valueChanges.pipe(
      map(result => {
        const data = result.data.pacientes.edges;
        this.pets = [];
        data.forEach(n => {
          this.pets.push(n.node);
        });
        //this.dataSource = new MatTableDataSource(this.pets);
        //this.pets = result.data.pacientes.edges;
        this.dataSource = new MatTableDataSource(this.pets);
        console.log(result);
        return result.data.pets;
      })
    );
    this.pets$.subscribe(data => {
      console.log('wenas', data);
    });
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
