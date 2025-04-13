const prisma = require('../config/db');

const getAllDestinations = async (req, res) => {
    try {
        const destinations = await prisma.destinations.findMany();
        res.status(200).json(destinations);
    } catch (error) {
        console.error(error);
        res.status(400).send('Error occurred fetching destinations');
    }
};

const getDestinationById = async (req, res) => {
    try {
        const destination = await prisma.destinations.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!destination) {
            return res.status(404).send('Destination not found');
        }
        return res.status(200).json(destination);
    } catch (error) {
        console.error(error);
        return res.status(400).send('Error occurred fetching destination');
    }
};

const getUniqueTags = async (req, res) => {
    try {

        const destinationTags = await prisma.destinations.findMany({
            select: {
                tags: true,
            }
        },);

        if (!destinationTags || destinationTags.length === 0) {
            return res.status(500).send('No tags found');
        }

        const allTags = destinationTags.flatMap(dest => dest.tags);

        const uniqueTags = [...new Set(allTags)];

        return res.status(200).json(uniqueTags);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Error ${error} occurred while fetching tags`);
    }
};

module.exports = {
    getAllDestinations,
    getDestinationById,
    getUniqueTags
};