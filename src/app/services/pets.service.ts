import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetItem } from '../models/pet';
@Injectable({
  providedIn: 'root'
})
export class PetsService {

  constructor(public http: HttpClient) { }

  getPets(): Observable<any> {
    return this.http.get('/assets/mockups/pets.json');
  }

  savePet(pet: PetItem): Observable<any> {
    return this.http.post('/assets/mockups/pets.json', JSON.stringify(pet));
  }
}
