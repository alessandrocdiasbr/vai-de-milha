import { generateMilesForTrip, getMilesFromCode } from "../../src/services/miles-service";
import { findMiles, saveMiles } from "../../src/repositories/miles-repository";
import * as distanceService from "../../src/services/distances-calculator-service";
import { faker } from "@faker-js/faker";
import { Trip, ServiceClass, AffiliateStatus } from "../../src/protocols";

jest.mock("../../src/repositories/miles-repository");
jest.mock("../../src/services/distances-calculator-service");

function createTrip(): Trip {
  return {
    code: faker.string.alphanumeric(6),
    origin: { lat: faker.location.latitude(), long: faker.location.longitude() },
    destination: { lat: faker.location.latitude(), long: faker.location.longitude() },
    miles: false,
    plane: faker.word.noun(),
    service: ServiceClass.ECONOMIC,
    date: "2025-05-15",
    affiliate: AffiliateStatus.BRONZE
  };
}

describe("Miles Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully generate and save miles for a new trip", async () => {
    const trip = createTrip();
    (findMiles as jest.Mock).mockResolvedValue(null);
    (distanceService.calculateDistance as jest.Mock).mockReturnValue(3000);
    
    const result = await generateMilesForTrip(trip);
    
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);
    expect(saveMiles).toHaveBeenCalledWith(trip.code, result);
  });
  
  it("should return an error when miles already exist for a trip", async () => {
    const trip = createTrip();
    (findMiles as jest.Mock).mockResolvedValue({ code: trip.code, miles: 5000 });
    
    await expect(generateMilesForTrip(trip)).rejects.toMatchObject({
      type: "conflict",
      message: expect.stringContaining("Miles already registered for code"),
    });
  });
  it("should retrieve miles when a valid code is provided", async () => {
    const trip = createTrip();
    const milesData = { code: trip.code, miles: 5000 };
    (findMiles as jest.Mock).mockResolvedValue(milesData);

    const result = await getMilesFromCode(trip.code);
    expect(result).toEqual(milesData);
  });

  it("should throw not found error when code doesn't exist", async () => {
    const code = faker.string.alphanumeric(6);
    (findMiles as jest.Mock).mockResolvedValue(null);

    await expect(getMilesFromCode(code)).rejects.toMatchObject({
      type: "not_found",
      message: expect.stringContaining("not found")
    });
  });
});


