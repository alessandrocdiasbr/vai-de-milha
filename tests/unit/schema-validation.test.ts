import { validateSchema } from "../../src/middlewares/schema-validation";
import milesSchema from "../../src/schemas/miles-schema";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ServiceClass } from "../../src/protocols";

describe("Schema Validation Middleware", () => {
  it("should return 422 when invalid data is provided", () => {
    const req = { body: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn();
    
    validateSchema(milesSchema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should call next when valid data is provided", () => {
    const req = { body: { code: "ABC123", origin: { lat: 0, long: 0 }, destination: { lat: 1, long: 1 }, miles: false, plane: "Boeing 737", service: ServiceClass.ECONOMIC, date: "2025-05-15" } } as Request;
    const res = {} as Response;
    const next = jest.fn();
    
    validateSchema(milesSchema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});