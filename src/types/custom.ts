import { Request } from "express";

export interface CustomUser {
  id: number;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CustomUser;
}
