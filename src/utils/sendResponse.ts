import { Response } from "express";

type ResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

const sendResponse = <T>(res: Response, responseData: ResponseData<T>) => {
  const { statusCode, success, message, data } = responseData;
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
