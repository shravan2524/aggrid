export const yupEmptyCharsRule = {
    message: () => 'Cannot be only empty characters',
    test: async (val) => val?.split(' ').join('').length !== 0,
};

export const validGSTINRule = {
    message: () => 'Enter a valid GSTIN',
    test: async (val) => {
        if (val) {
            return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
        }
        return true;
    },
};
