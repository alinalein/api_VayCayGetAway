const Destinations = require('../models/destination').Destination;

const getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destinations.find();
        res.status(200).json(destinations);
    } catch (error) {
        console.error(error);
        res.status(400).send('Error occurred fetching destinations');
    }
};

const getDestinationById = async (req, res) => {
    try {
        const destination = await Destinations.findOne({ _id: req.params.id });
        return res.status(200).json(destination);
    } catch (error) {
        console.error(error);
        return res.status(400).send('Error occurred fetching destination');
    }
};

const getUniqueTags = async (req, res) => {
    try {

        // fetch only tags field, all arrays from destinations with tags
        // {} all documents -> 'tags' from all documents only the tags field
        const destinationTags = await Destinations.find({}, 'tags');
        if (!destinationTags || destinationTags.length === 0) {
            return res.status(500).send('No tags found');
        }

        // flatMap -> maps through arrays and flatten : [["a", "b"], ["c", "d"]] ->["a", "b", "c", "d"]
        const allTags = destinationTags.flatMap(dest => dest.tags);

        // Set is a built-in JavaScript object that only stores unique values.
        // [...new Set(array)] -> turn array into a Set (removing duplicates) -> spread operator (...) to convert it back into a normal array
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