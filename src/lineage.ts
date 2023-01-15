import {pipe} from 'lodash/fp';
import {findDescendantImports} from './find-descendant-imports';
import {dbg} from './util';

export const lineage = (filePath: string, tsconfigPath?:string) => {
	pipe(findDescendantImports, dbg)(filePath, tsconfigPath);
};
