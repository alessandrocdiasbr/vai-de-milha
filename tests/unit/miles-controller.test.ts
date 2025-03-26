import { Request, Response } from "express";
import httpStatus from "http-status";
import { generateMiles, recoverMiles } from "../../src/controllers/miles-controller";
import { generateMilesForTrip, getMilesFromCode } from "../../src/services/miles-service";
import { faker } from "@faker-js/faker";
import { Trip, ServiceClass } from "../../src/protocols";

jest.mock("../../src/services/miles-service");

function createTrip(): Trip {
  return {
    code: faker.string.alphanumeric(6),
    origin: { lat: faker.location.latitude(), long: faker.location.longitude() },
    destination: { lat: faker.location.latitude(), long: faker.location.longitude() },
    miles: false,
    plane: faker.word.noun(),
    service: ServiceClass.ECONOMIC,
    date: "2025-05-15"
  };
}

describe("Miles Controller", () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMiles", () => {
    it("should generate miles successfully", async () => {
      const trip = createTrip();
      const milesData = { code: trip.code, miles: 5000 };
      (generateMilesForTrip as jest.Mock).mockResolvedValue(milesData);

      const req = { body: trip } as Request;
      const res = mockResponse();

      await generateMiles(req, res);

      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        miles: milesData,
        code: trip.code
      });
    });

    it("should handle errors when generating miles", async () => {
      const trip = createTrip();
      const error = { type: "conflict", message: "Miles already exist" };
      (generateMilesForTrip as jest.Mock).mockRejectedValue(error);

      const req = { body: trip } as Request;
      const res = mockResponse();

      await expect(generateMiles(req, res)).rejects.toEqual(error);
    });
  });

  describe("recoverMiles", () => {
    it("should recover miles successfully", async () => {
      const code = faker.string.alphanumeric(6);
      const milesData = { code, miles: 5000 };
      (getMilesFromCode as jest.Mock).mockResolvedValue(milesData);

      const req = { params: { code } } as unknown as Request;
      const res = mockResponse();

      await recoverMiles(req, res);

      expect(res.send).toHaveBeenCalledWith(milesData);
    });

    it("should handle errors when miles are not found", async () => {
      const code = faker.string.alphanumeric(6);
      const error = { type: "not_found", message: "Miles not found" };
      (getMilesFromCode as jest.Mock).mockRejectedValue(error);

      const req = { params: { code } } as unknown as Request;
      const res = mockResponse();

      await expect(recoverMiles(req, res)).rejects.toEqual(error);
    });
  });
});