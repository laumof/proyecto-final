import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PetsService {

  constructor(public http: HttpClient) { }

  getPets(): Observable<any> {
    return this.http.get('/assets/mockups/pets.json');
  }
}
