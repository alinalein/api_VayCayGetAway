import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT secret is not defined in environment variables.");
}

let generateJWTToken = (user: JwtPayload): string => {
  // jwt.sign(payload, secretKey, options)
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    jwtSecret,
    {
      subject: user.username,
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
};

export default generateJWTToken;
