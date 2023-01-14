import {pipe} from 'lodash/fp';

export const dbg = (input: unknown) => {
	pipe(input => JSON.stringify(input, null, 2), console.log)(input);
};

