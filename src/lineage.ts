import {pipe} from 'lodash/fp';
import Debug from "debug";
import {copyDescendantImports} from './copy-descendant-imports';
import {findDescendantImports, Map1} from './find-descendant-imports';
import {dbg, dbgTap, maybeToAbsolutePath, toAbsolutePath} from './util';

const debug = Debug("lineage-ts");

export const lineage = (
	filePath: string,
	tsConfigPath?: string,
	destDir?: string,
) => {
	const absFilePath = toAbsolutePath(filePath);
	const absTsconfigPath = maybeToAbsolutePath(tsConfigPath)
	const absDestDir = maybeToAbsolutePath(destDir)

	pipe(
		() => findDescendantImports(absFilePath, absTsconfigPath),
		(_: Map1) => dbgTap(_,debug),
		(_: Map1) => copyDescendantImports(_, absDestDir),
		() => {
			dbg('done');
		},
	)();
};
