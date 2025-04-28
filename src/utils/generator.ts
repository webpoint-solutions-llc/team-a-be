import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../config";

const otpGenerator = (): string => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
};

const generateJwt = (email: string, id: string): string => {
  const token = jwt.sign({ email, id } as JwtPayload, jwtSecret as string, {
    expiresIn: "7d",
  });
  return token;
};





export {  otpGenerator, generateJwt, };