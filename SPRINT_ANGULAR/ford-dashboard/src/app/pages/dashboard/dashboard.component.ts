import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { Vehicle, VehicleData } from '../../models/car';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  vehicleSearchTerm = '';

  vinSearchTerm = '';
  vehicleDataList: VehicleData[] = [];
  isMenuOpen = false;

  private vinSearch$ = new Subject<string>();

  private imageMap: { [key: string]: string } = {
    'ranger': 'ranger.png',
    'mustang': 'mustang.png',
    'territory': 'territory.png',
    'bronco sport': 'broncoSport.png'
  };

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const vehicleIdParam = this.route.snapshot.paramMap.get('vehicleId');

    this.dashboardService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;

      if (vehicleIdParam) {
        const found = vehicles.find(v => v.id === +vehicleIdParam);
        if (found) {
          this.selectVehicle(found);
        }
      }
    });

    this.vinSearch$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter(term => term.length > 2 || term.length === 0),
      switchMap(term => {
        if (term.length === 0) {
          return new Subject<VehicleData[]>().asObservable();
        }
        return this.dashboardService.getVehicleData(term);
      })
    ).subscribe(data => {
      this.vehicleDataList = data;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  onVinSearchChange(term: string): void {
    this.vinSearchTerm = term;

    if (!term.trim()) {
      this.vehicleDataList = [];
      return;
    }

    this.vinSearch$.next(term.trim());
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.vehicleSearchTerm = vehicle.vehicle;
  }

  getVehicleById(id: number): Vehicle {
    return this.vehicles.find(v => v.id === +id) as Vehicle;
  }

  getVehicleImage(): string {
    if (!this.selectedVehicle) return '';
    const key = this.selectedVehicle.vehicle.toLowerCase();
    const file = this.imageMap[key];
    return file ? `img/${file}` : 'img/ford.png';
  }
}