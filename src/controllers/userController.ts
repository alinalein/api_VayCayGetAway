import { body } from "express-validator";
import prisma from "../config/db";
import validationErrors from "../utils/validationErros";
import validateANDhash from "../utils/validateANDhash";
const { validatePassword, hashPassword } = validateANDhash;
import { Request, Response } from "express";
import { User } from "@prisma/client";

import { AuthenticatedRequest } from "../types/custom";

const signUp = [
  body("username")
    .isAlphanumeric()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("email").isEmail().withMessage("Please pick a valid email address"),
  body("birthday")
    .isISO8601()
    .toDate()
    .withMessage("Birthday must be a valid date (YYYY-MM-DD)"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (validationErrors(req, res)) return;

      if (!req.body.username) {
        res.status(401).send("User required");
        return;
      }
      const existingUser: User | null = await prisma.user.findUnique({
        where: { username: req.body.username },
      });

      if (existingUser) {
        res
          .status(403)
          .send(
            `Username ${req.body.username} already exists, please pick another one`
          );
        return;
      } else {
        try {
          const hashedPassword = hashPassword(req.body.password);
          const newUser = await prisma.user.create({
            data: {
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
              birthday: req.body.birthday,
            },
          });
          res.status(200).json({
            status: "sign up successful",
            username: newUser.username,
            email: newUser.email,
            birthday: newUser.birthday,
          });
        } catch (error) {
          res.status(400).send(`Profile could not be created: ${error} `);
        }
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      res.status(500).send(`An unknown ${error} occured`);
    }
  },
];

// Promise is onyly used in async functions , when no async then just void instead of Promise<void>
const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    // Marks the cookie as inaccessible to JavaScript running in the browser.
    // Prevents XSS (Cross-Site Scripting) attacks from stealing your JWT or session cookie.
    httpOnly: true,
    // Cookie can be sent over plain HTTP in dev, but Cookie will only be sent over HTTPS in production.
    // secure: true, the cookie will only be sent over HTTPS, so when in development and use HTTP , it will get an error
    // secure: false, the cookie will only be sent over HTTP too even in production, can be hacked easier
    secure: true,
    // Controls when a cookie is sent with cross-origin requests (e.g., frontend on one domain, API on another).
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out" });
  return;
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    res.status(400).send(`could not get all users ${error}`);
  }
};

const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).send("Unauthorized");
      return;
    }

    const deletedUser = await prisma.user.delete({ where: { id: userId } });
    res.status(200).send(`Profile deleted successful`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    res.status(400).send(`Profile couldn't be deleted, error ${error}`);
  }
};

const updateProfile = [
  body("username")
    .isAlphanumeric()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters"),
  body("email").isEmail().withMessage("Please pick a valid email address"),
  body("birthday")
    .isISO8601()
    .toDate()
    .withMessage("Birthday must be a valid date (YYYY-MM-DD)"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (validationErrors(req, res)) return;

      // try to access user - if user - null - will not crash because of ?
      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) {
        res.status(401).send("You must be logged in for this operation");
        return;
      }

      const { username, email, birthday } = req.body;
      if (!username && !email && !birthday) {
        res.status(400).send("fill out all fields to update the profile ");
        return;
      }

      const existingUser = await prisma.user.findUnique({
  where: { username },
});

if (existingUser) {
  if (String(existingUser.id) === String(userId)) {
    // The user is trying to save the same username they already have
     res.status(400).send('No change in username detected.');
     return
  } else {
    // The username is already taken by another user
     res
      .status(409)
      .send(`Username "${existingUser.username}" already exists, please pick another one.`);
  return}
}

      
   
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: username,
          email: email,
          birthday: birthday,
        },
      });

      // takes password out of updatedUser
      const { password, ...safeUser } = updatedUser;
      res.status(200).json(safeUser);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      res.status(400).send(`Profile couldn't be updated, error ${error}`);
    }
  },
];

const deleteDestination = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    const { type, destinationId } = req.params;
    const destinationIdInt = parseInt(destinationId);
    const validTypes = ["visited", "favorite"];

    if (!validTypes.includes(type)) {
      res.status(400).send(`Invalid type. Valid types are ${validTypes}`);
      return;
    }

    if (!userId || isNaN(destinationIdInt)) {
      res.status(400).send("Invalid user or destination ID.");
      return;
    }

    // Handle "visited"
    if (type === "visited") {
      const isInList = await prisma.visitedDestination.findUnique({
        where: {
          user_id_destination_id: {
            user_id: userId,
            destination_id: destinationIdInt,
          },
        },
      });

      if (!isInList) {
        res.status(404).send(`No such destination in ${type}`);
        return;
      }

      await prisma.visitedDestination.delete({
        where: {
          user_id_destination_id: {
            user_id: userId,
            destination_id: destinationIdInt,
          },
        },
      });
    } else {
      // Handle "favorite"
      const isInList = await prisma.favoriteDestination.findUnique({
        where: {
          user_id_destination_id: {
            user_id: userId,
            destination_id: destinationIdInt,
          },
        },
      });

      if (!isInList) {
        res.status(404).send(`No such destination in ${type}`);
        return;
      }

      await prisma.favoriteDestination.delete({
        where: {
          user_id_destination_id: {
            user_id: userId,
            destination_id: destinationIdInt,
          },
        },
      });
    }
    res.status(200).json({
      message: `Destination removed from list ${type}`,
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    res
      .status(400)
      .send(`Error ${error} occured while removing destination from favorites`);
  }
};

const addDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    const { destinationId, type } = req.params;
    const destinationIdInt = parseInt(destinationId);

    const validTypes = ["visited", "favorite"];

    if (!validTypes.includes(type)) {
      res.status(400).send(`Invalid type. Allowed types are ${validTypes}`);
      return;
    }

    if (!userId || isNaN(destinationIdInt)) {
      res.status(400).send("Invalid user or destination ID.");
      return;
    }
    if (type === "favorite") {
      const exists = await prisma.favoriteDestination.findUnique({
        where: {
          user_id_destination_id: {
            user_id: userId,
            destination_id: destinationIdInt,
          },
        },
      });

      if (exists) {
        res.status(409).send("Destination is already in your favorite list");
        return;
      }

      await prisma.favoriteDestination.create({
        data: {
          user_id: userId,
          destination_id: destinationIdInt,
        },
      });

      res.status(200).json({ message: "Destination added to favorite list" });
    } else {
      const exists = await prisma.visitedDestination.findUnique({
        where: {
          user_id_destination_id: {
            user_id: userId,
            destination_id: destinationIdInt,
          },
        },
      });

      if (exists) {
        res.status(409).send("Destination is already in your visited list");
        return;
      }

      await prisma.visitedDestination.create({
        data: {
          user_id: userId,
          destination_id: destinationIdInt,
        },
      });

      res.status(200).json({
        message: `Destination added to List ${type}`,
      });
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    res
      .status(400)
      .send(`Error ${error} occured while removing adding to favorites`);
  }
};

const usersDestinations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    const validTypes = ["visited", "favorite"];
    const requestType = req.params.type;
    if (!validTypes.includes(requestType)) {
      res.status(400).send(`Allowed types are ${validTypes}`);
      return;
    }
    if (!userId) {
      res.status(400).send("Invalid user ID.");
      return;
    }
    let usersList:
      | { destination: any }[] // You can replace `any` with a proper `Destination` type if defined
      | undefined;

    if (requestType === "favorite") {
      usersList = await prisma.favoriteDestination.findMany({
        where: { user_id: userId },
        include: { destination: true },
      });
    } else {
      usersList = await prisma.visitedDestination.findMany({
        where: { user_id: userId },
        // gets the full related destination info via foreign key - here destination_id

        include: { destination: true },
      });
    }

    res.status(200).json({
      userDestinations: usersList.map(
        (entry: { destination: any }) => entry.destination
      ),
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    res
      .status(500)
      .send(`An error: ${error} occurred while fetching the user's list.`);
  }
};

const changePasswordJWT = [
  body("newPassword")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (validationErrors(req, res)) return;

      const userId = (req as AuthenticatedRequest).user?.id;
      if (!userId) {
        res.status(400).send("Invalid user ID.");
        return;
      }
      const existingUser: User | null = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser || !existingUser.password) {
        res.status(404).send("User not found or password not set.");
        return;
      }

      const passwordCheck = validatePassword(
        req.body.password,
        existingUser.password
      );

      if (!passwordCheck) {
        res
          .status(403)
          .send(
            "Please type your current password to change it to a new password"
          );
        return;
      }

      const newPassword = hashPassword(req.body.newPassword);
      const updatedPassword = await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPassword,
        },
      });
      res
        .status(200)
        .send(`Password changed successfull for ${existingUser.username}`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      res
        .status(500)
        .send(`Error ${error} occured while changing the password`);
    }
  },
];

export default {
  signUp,
  addDestination,
  deleteDestination,
  updateProfile,
  deleteProfile,
  getAllUsers,
  changePasswordJWT,
  usersDestinations,
  logout,
};
