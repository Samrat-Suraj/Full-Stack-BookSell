import { Response } from "express";
import jwt from "jsonwebtoken";
import EnvVars from "../config/EnvVars";

const generateAndSetAuthCookie = (userId: string, res: Response): string => {
  const token = jwt.sign({ userId }, EnvVars.JWT_SECRET, { expiresIn: "15d"});

  res.cookie("books", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure : true,
  });

  return token;
};

export default generateAndSetAuthCookie;
