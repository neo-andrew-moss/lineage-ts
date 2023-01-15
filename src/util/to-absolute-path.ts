import * as path from 'path';

export const toAbsolutePath = (filePath: string) => {
	if (path.isAbsolute(filePath)) {
		return filePath;
	}

	return path.resolve(filePath);
};

export const maybeToAbsolutePath = (filePath?: string) => {
	if (!filePath) {
		return undefined;
	}

	return toAbsolutePath(filePath);
};
