import {pipe} from 'lodash/fp';
import {type Map1} from './find-descendant-imports';
import {copyFiles} from './util';

export const copyDescendantImports = (
	imports: Map1,
	destination?: string,
) => {
	if (!destination) {
		throw new Error('destination not specified');
	}

	const res: string[] = pipe(Object.fromEntries, Object.keys)(imports);

	copyFiles(res, destination);
};
