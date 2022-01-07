import { Request, Response } from 'express';

export async function ResponseJSON(
  request: Request,
  response: Response,
): Promise<Response> {
  return response
    .status(200)
    .json({ status: 200, message: 'Request received with success.' });
}
