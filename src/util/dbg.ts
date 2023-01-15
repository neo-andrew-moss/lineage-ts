import {pipe} from 'lodash/fp';

export const dbgJson = <T>(input: T, logger = console.log) => {
	pipe(input => JSON.stringify(input, null, 2), logger)(input);
};

export const dbg = <T>(input: T, logger = console.log) => {
	pipe(logger)(input);
};

export const dbgTap = <T>(input: T, logger = console.log): T =>
	pipe(_ => {
		logger(_);
		return _;
	})(input);
