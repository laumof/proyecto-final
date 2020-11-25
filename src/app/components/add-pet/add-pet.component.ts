import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PetItem } from 'src/app/models/pet';
import { PetsService } from 'src/app/services/pets.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.scss']
})
export class AddPetComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    size: new FormControl(null, [Validators.required]),
    species: new FormControl(null, [Validators.required]),
    race: new FormControl(null, [Validators.required]),
    age: new FormControl(null),
    color: new FormControl(null),
    situation: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    owner: new FormControl(null, [Validators.required]),
    phone1: new FormControl(null, [Validators.required]),
    phone2: new FormControl(null),
    dpi: new FormControl(null, [Validators.required]),
    address: new FormControl(null),
    admissionDate: new FormControl(new Date(), [Validators.required]),
    doctor: new FormControl(null, [Validators.required]),
    departureDate: new FormControl(new Date(), [Validators.required]),
    cost: new FormControl(null, [Validators.required]),
  });
  constructor(public dialogRef: MatDialogRef<AddPetComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              public petsService: PetsService) { }

  ngOnInit(): void {
  }

  public findInvalidControls(): any {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}
  save(): void {
    console.log(this.findInvalidControls());
    if (this.form.invalid) { return; }
    const newpet: PetItem = { ...this.form.value };
    this.petsService.savePet(newpet).subscribe(data => {
      this.dialogRef.close(true);
    }, err => {
      alert('Hubo un error al guardar el ingreso, intente de nuevo más tarde');
    });

  }

}
