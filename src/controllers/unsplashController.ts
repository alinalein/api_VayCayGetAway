import { Request, Response } from "express";
import axios from "axios";
import prisma from "../config/db";
import { ImageHorizontalArray, ImageVertical } from "../types/unsplash";

const saveSelectedUnsplashImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { photoId, destinationName, orientation } = req.body;

  if (!photoId || !destinationName || !orientation) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    // URL from API : `https://api.unsplash.com/photos/${photoId}?client_id=${ACCESS_KEY}`;
    const unsplashRes = await axios.get(
      `https://api.unsplash.com/photos/${photoId}`,
      {
        headers: {
          Authorization: `Client-ID ${unsplashKey}`,
        },
      }
    );

    const photo = unsplashRes.data;
    const imageUrl = photo.urls.regular;
    const credit = photo.user.name;

    const destination = await prisma.destination.findFirst({
      where: {
        name: {
          equals: destinationName,
          mode: "insensitive", // case insensitiv
        },
      },
      select: {
        id: true,
        image_horizontal: true,
        image_vertical: true,
      },
    });

    if (!destination) {
      res.status(404).json({ message: "Destination not found." });
      return;
    }

    if (orientation === "horizontal") {
      const existing =
        (destination.image_horizontal as ImageHorizontalArray) || [];

      // add to the existing array the new picture object
      const updated: ImageHorizontalArray = [
        ...existing,
        {
          url: imageUrl,
          creditor: credit,
        },
      ];

      await prisma.destination.update({
        where: { id: destination.id },
        data: {
          image_horizontal: updated,
        },
      });
    } else if (orientation === "vertical") {
      const vertical: ImageVertical = {
        url: imageUrl,
        creditor: credit,
      };

      // update the field with an object of the picture
      await prisma.destination.update({
        where: { id: destination.id },
        data: {
          image_vertical: vertical,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid orientation." });
      return;
    }

    res.status(200).json({ message: "Image saved successfully." });
    return;
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

const getAllImagesByQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.query.query;
  const page = req.query.page || 1;

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        page,
        per_page: 25,
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Unsplash error:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

export default { saveSelectedUnsplashImage, getAllImagesByQuery };
