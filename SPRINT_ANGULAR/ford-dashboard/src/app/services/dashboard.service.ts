import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Vehicle, VehicleResponse, VehicleData, VehicleDataResponse } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/vehicle`).pipe(
      pluck('vehicles')
    );
  }

  getVehicleData(vin?: string): Observable<VehicleData[]> {
    let url = `${this.apiUrl}/vehicleData`;
    
    if (vin && vin.trim()) {
      url += `?vin=${vin.trim()}`;
    }

    return this.http.get<VehicleDataResponse>(url).pipe(
      map(res => res.vehicleData)
    );
  }
}