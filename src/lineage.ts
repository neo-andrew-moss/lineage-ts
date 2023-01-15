import {pipe} from 'lodash/fp';
import { copyDescendantImports } from './copy-descendant-imports';
import {findDescendantImports} from './find-descendant-imports';
import {dbg} from './util';

export const lineage = (filePath: string, tsconfigPath?:string,destDir?:string) => {
	const ff = copyDescendantImports(findDescendantImports(filePath,tsconfigPath), destDir)
	dbg(ff)
};
