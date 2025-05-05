import filter from 'leo-profanity';

const checkForProfanity = (value: string): boolean => {
    if (filter.check(value)) {
        throw new Error('Comment contains inappropriate language.');
    }
    return true;
};

export default checkForProfanity;