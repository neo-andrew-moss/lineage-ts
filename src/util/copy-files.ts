import * as fs from 'fs';
import * as path from 'path';
import {dbg} from './dbg';

const commonBasePath = (filePaths: string[]) => {
	let commonPath = path.dirname(filePaths[0]);
	for (let i = 1; i < filePaths.length; i++) {
		while (!filePaths[i].startsWith(commonPath)) {
			commonPath = path.dirname(commonPath);
		}
	}

	return commonPath;
};

const copyFile = (
	filePath: string,
	commonBasePath: string,
	destDir: string,
) => {
	const relativeFilePath = path.relative(commonBasePath, filePath);
	const destFilePath = path.join(destDir, relativeFilePath);
	const destFileDir = path.dirname(destFilePath);

	if (!fs.existsSync(destFileDir)) {
		fs.mkdirSync(destFileDir, {recursive: true});
	}

	fs.copyFileSync(filePath, destFilePath);
};

export const copyFiles = (filePaths: string[], destination: string) => {
	const _commonBasePath = commonBasePath(filePaths);
	filePaths.map(filePath => {
		copyFile(filePath, _commonBasePath, destination);
	});
};
