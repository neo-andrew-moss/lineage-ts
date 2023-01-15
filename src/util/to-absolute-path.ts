import * as path from 'path';

export const toAbsolutePath = (filePath: string) => {
	if (path.isAbsolute(filePath)) {
		return filePath;
	}

	return path.resolve(filePath);
};

export const toAbs = (...filePaths: Array<string | undefined>) => filePaths.map(f => f ? toAbsolutePath(f) : undefined);
