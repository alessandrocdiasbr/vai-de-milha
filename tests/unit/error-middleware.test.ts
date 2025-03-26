import { Request, Response, NextFunction } from "express";
import errorHandlerMiddleware from "../../src/middlewares/error-middleware";

describe("Error Middleware", () => {
  const mockRequest = {} as Request;
  const mockNext = jest.fn() as NextFunction;

  const mockResponse = () => {
    const res = {} as Response;
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle unauthorized error", () => {
    const res = mockResponse();
    const error = { type: "unauthorized", message: "Não autorizado" };

    errorHandlerMiddleware(error, mockRequest, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should handle conflict error", () => {
    const res = mockResponse();
    const error = { type: "conflict", message: "Conflito detectado" };

    errorHandlerMiddleware(error, mockRequest, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(409);
  });

  it("should handle not found error", () => {
    const res = mockResponse();
    const error = { type: "not_found", message: "Recurso não encontrado" };

    errorHandlerMiddleware(error, mockRequest, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it("should handle bad request error", () => {
    const res = mockResponse();
    const error = { type: "bad_request", message: "Requisição inválida" };

    errorHandlerMiddleware(error, mockRequest, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  it("should handle unknown error with 500 status", () => {
    const res = mockResponse();
    const error = { type: "unknown_error", message: "Erro desconhecido" };

    errorHandlerMiddleware(error, mockRequest, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});