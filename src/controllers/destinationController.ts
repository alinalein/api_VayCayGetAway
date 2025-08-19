import prisma from "../config/db";
import { Request, Response } from "express";
import { Destination } from "@prisma/client";

const getAllDestinations = async (req: Request, res: Response): Promise<void> => {
    try {
        const allDestinations = await prisma.destination.findMany();
        res.status(200).json(allDestinations);
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        res.status(400).send('Error occurred fetching destinations');
    }
};

const getDestinationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const destination: Destination | null = await prisma.destination.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!destination) {
            res.status(404).send('Destination not found');
            return
        }
        res.status(200).json(destination);
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        res.status(400).send('Error occurred fetching destination');
    }
};

const getUniqueTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const destinationTags = await prisma.destination.findMany({
            select: {
                tags: true
            }
        },);

        if (!destinationTags || destinationTags.length === 0) {
            res.status(500).send('No tags found');
            return
        }

        const allTags = destinationTags.flatMap(dest => dest.tags);

        const uniqueTags = [...new Set(allTags)];

        res.status(200).json(uniqueTags);
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        res.status(500).send(`Error ${error} occurred while fetching tags`);
    }
};

export default {
    getAllDestinations,
    getDestinationById,
    getUniqueTags
};