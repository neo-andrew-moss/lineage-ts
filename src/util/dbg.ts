import {pipe} from 'lodash/fp';

export const dbgJson = (input: unknown) => {
	pipe(input => JSON.stringify(input, null, 2), console.log)(input);
};

export const dbg = (input: unknown) => {
	pipe(console.log)(input);
};
