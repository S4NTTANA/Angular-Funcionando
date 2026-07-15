export interface Vehicle {
  id: number;
  vehicle: string;
  volumetotal: number;
  connected: number;
  softwareUpdates: number;
}

export interface VehicleResponse {
  vehicles: Vehicle[];
}

export interface VehicleData {
  vin: string;
  odometer: string;
  fuelLevel: string;
  status: string;
  lat: string;
  long: string;
}

export interface VehicleDataResponse {
  vehicleData: VehicleData[];
}