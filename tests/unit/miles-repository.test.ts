import { findMiles, saveMiles } from "../../src/repositories/miles-repository";
import prisma from "../../src/database";
import { faker } from "@faker-js/faker";

jest.mock("../../src/database", () => ({
  __esModule: true,
  default: {
    miles: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));

describe("Miles Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findMiles", () => {
    it("should return miles when found", async () => {
      const milesData = {
        id: 1,
        code: faker.string.alphanumeric(6),
        miles: 5000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.miles.findUnique as jest.Mock).mockResolvedValue(milesData);

      const result = await findMiles(milesData.code);

      expect(result).toEqual(milesData);
      expect(prisma.miles.findUnique).toHaveBeenCalledWith({
        where: { code: milesData.code }
      });
    });

    it("should return null when miles not found", async () => {
      const code = faker.string.alphanumeric(6);
      (prisma.miles.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await findMiles(code);

      expect(result).toBeNull();
      expect(prisma.miles.findUnique).toHaveBeenCalledWith({
        where: { code }
      });
    });

    it("should throw error when database fails", async () => {
      const code = faker.string.alphanumeric(6);
      const error = new Error("Database connection failed");
      (prisma.miles.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(findMiles(code)).rejects.toThrow(error);
    });
  });

  describe("saveMiles", () => {
    it("should save miles successfully", async () => {
      const milesData = {
        id: 1,
        code: faker.string.alphanumeric(6),
        miles: 5000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.miles.create as jest.Mock).mockResolvedValue(milesData);

      const result = await saveMiles(milesData.code, milesData.miles);

      expect(result).toEqual(milesData);
      expect(prisma.miles.create).toHaveBeenCalledWith({
        data: {
          code: milesData.code,
          miles: milesData.miles
        }
      });
    });

    it("should throw error when saving fails", async () => {
      const code = faker.string.alphanumeric(6);
      const miles = 5000;
      const error = new Error("Database connection failed");
      (prisma.miles.create as jest.Mock).mockRejectedValue(error);

      await expect(saveMiles(code, miles)).rejects.toThrow(error);
    });
  });
});