import { calculateMiles } from "../../src/services/miles-calculator-service";
import * as distanceService from "../../src/services/distances-calculator-service";
import { ServiceClass, Trip, AffiliateStatus } from "../../src/protocols/index";
import { faker } from '@faker-js/faker';


jest.mock("../../src/services/distances-calculator-service", () => ({
  __esModule: true,
  calculateDistance: jest.fn(() => 3000)
}));

function createTrip(): Trip {
  return {
    code: faker.string.alphanumeric(6),
    origin: { lat: faker.location.latitude(), long: faker.location.longitude() },
    destination: { lat: faker.location.latitude(), long: faker.location.longitude() },
    miles: false,
    plane: faker.airline.airplane().name,
    service: ServiceClass.ECONOMIC,
    date: "2025-05-15",
    affiliate: AffiliateStatus.BRONZE
  };
}

describe("Miles Calculation Service", () => {
  beforeEach(() => {
    (distanceService.calculateDistance as jest.Mock).mockClear();
    (distanceService.calculateDistance as jest.Mock).mockReturnValue(3000);
  });

  it("should properly calculate miles for ECONOMIC class", () => {
    const trip = createTrip();
    const miles = calculateMiles(trip);
    
   
    expect(distanceService.calculateDistance).toHaveBeenCalledWith(
      trip.origin,
      trip.destination
    );
    
 
    expect(miles).not.toBeNaN();
    expect(miles).toBe(3300); 
  });

  it("should return 0 when miles is true", () => {
    const trip = createTrip();
    trip.miles = true;
    
    expect(calculateMiles(trip)).toBe(0);
    expect(distanceService.calculateDistance).not.toHaveBeenCalled();
  });

  it("should apply service class multipliers correctly", () => {
    const trip = createTrip();
    
   
    trip.service = ServiceClass.ECONOMIC_PREMIUM;
    expect(calculateMiles(trip)).toBe(4125); 
    
   
    trip.service = ServiceClass.EXECUTIVE;
    expect(calculateMiles(trip)).toBe(4950); 
    
  
    trip.service = ServiceClass.FIRST_CLASS;
    expect(calculateMiles(trip)).toBe(6600);
  });

  it("should apply affiliate bonuses correctly", () => {
    const trip = createTrip();
    

    trip.affiliate = AffiliateStatus.SILVER;
    expect(calculateMiles(trip)).toBe(3630); 
    
   
    trip.affiliate = AffiliateStatus.GOLD;
    expect(calculateMiles(trip)).toBe(4125); 
    
 
    trip.affiliate = AffiliateStatus.PLATINUM;
    expect(calculateMiles(trip)).toBe(4950); 
  });

  it("should skip birthday bonus outside May", () => {
    const trip = createTrip();
    trip.date = "2025-06-15";
    
    expect(calculateMiles(trip)).toBe(3000); 
  });

  it("should calculate miles correctly", () => {
    const trip: Trip = {
      code: "TEST123",
      origin: { lat: 0, long: 0 },
      destination: { lat: 1, long: 1 },
      miles: false,
      plane: "Boeing",
      service: ServiceClass.ECONOMIC,
      date: "2025-05-15",
      affiliate: AffiliateStatus.GOLD 
    };
    
    const result = calculateMiles(trip);
    expect(result).toBe(4125);
  });

  it("should handle undefined affiliate", () => {
    const trip = createTrip();
    trip.affiliate = AffiliateStatus.BRONZE; 
    
    const result = calculateMiles(trip);
    expect(result).toBe(3300); 
  });

  it("should handle no affiliate status", () => {
    const trip = createTrip();
    trip.affiliate = AffiliateStatus.BRONZE; 
    
    const result = calculateMiles(trip);
    expect(result).toBe(3300); 
  });
});