import {pipe} from 'lodash/fp';
import {copyDescendantImports} from './copy-descendant-imports';
import {findDescendantImports} from './find-descendant-imports';
import {dbg, toAbs, toAbsolutePath} from './util';

export const lineage = (
	filePath: string,
	tsconfigPath?: string,
	destDir?: string,
) => {
	const absFilePath = toAbsolutePath(filePath);
	const absTsconfigPath = tsconfigPath ? toAbsolutePath(tsconfigPath) : undefined;
	const absDestDir = destDir ? toAbsolutePath(destDir) : undefined;

	pipe(
		() => {
			copyDescendantImports(
				findDescendantImports(absFilePath, absTsconfigPath),
				absDestDir,
			);
		},
		() => {
			dbg('done');
		},
	)();
};
