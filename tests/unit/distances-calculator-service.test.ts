import { calculateDistance, toRadius, applyHaversineFormula } from "../../src/services/distances-calculator-service";
import { Location } from "../../src/protocols";

describe("Distances Calculator Service", () => {
  describe("calculateDistance", () => {
    it("should calculate distance in kilometers by default", () => {
      const origin: Location = { lat: -23.5505, long: -46.6333 }; 
      const destination: Location = { lat: -22.9068, long: -43.1729 }; 
      
      const distance = calculateDistance(origin, destination);
      expect(distance).toBe(361); 
    });

    it("should calculate distance in miles when isMiles is true", () => {
      const origin: Location = { lat: -23.5505, long: -46.6333 };
      const destination: Location = { lat: -22.9068, long: -43.1729 }; 
      
      const distance = calculateDistance(origin, destination, true);
      expect(distance).toBe(224); 
    });

    it("should handle same coordinates", () => {
      const point: Location = { lat: -23.5505, long: -46.6333 };
      const distance = calculateDistance(point, point);
      expect(distance).toBe(0);
    });

    it("should handle coordinates at antipodes", () => {
      const origin: Location = { lat: 0, long: 0 };
      const destination: Location = { lat: 0, long: 180 };
      
      const distance = calculateDistance(origin, destination);
      expect(distance).toBe(20015); 
    });
  });

  describe("toRadius", () => {
    it("should convert degrees to radians", () => {
      expect(toRadius(180)).toBe(Math.PI);
      expect(toRadius(90)).toBe(Math.PI / 2);
      expect(toRadius(0)).toBe(0);
      expect(toRadius(-90)).toBe(-Math.PI / 2);
    });
  });

  describe("applyHaversineFormula", () => {
    it("should calculate distance using Haversine formula", () => {
      const lat1 = toRadius(-23.5505);
      const lat2 = toRadius(-22.9068);
      const dLat = lat2 - lat1;
      const dLon = toRadius(-43.1729 - (-46.6333));
      const radius = 6371; 

      const distance = applyHaversineFormula(lat1, lat2, dLat, dLon, radius);
      expect(Math.round(distance)).toBe(361);
    });

    it("should return 0 for same points", () => {
      const lat = toRadius(-23.5505);
      const distance = applyHaversineFormula(lat, lat, 0, 0, 6371);
      expect(distance).toBe(0);
    });
  });
});