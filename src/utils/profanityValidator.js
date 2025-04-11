let filter;


// require('bad-words') doesnt work as bad-words is published as an ES module with a default export
// await import('bad-words') returns an object ->{ default: [class Filter], ... } 
// must access mod.default to get the class constructor
const loadBadWordsLibrary = async () => {
    //Only run the import if filter hasn't already been created, prevents multiple imports
    if (!filter) {
        // Returns an object with everything the module exports
        const mod = await import('bad-words')
        // get the named export Filter from the module
        // const Filter = mod.default; ->[Module: null prototype] { Filter: [class Filter] } , as filter is directly under mod
        const { Filter } = mod;
        // creates filter instance and shared across request
        filter = new Filter()
    }
}

const checkForProfanity = async (value) => {
    await loadBadWordsLibrary()
    //Uses bad-words to check if the comment contains profanity - bad words with  built-in method isProfane(...) from Filter
    if (filter.isProfane(value)) {
        throw new Error('Comment contains inappropriate language.');
    }
    return true;
};

module.exports = checkForProfanity;