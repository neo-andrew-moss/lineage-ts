import * as fs from 'fs';
import * as path from 'path';
import {join} from 'path';
import {dbg} from './dbg';

/**
 * Copy all descendants of a barrel file
 * @param filePath a filePath that includes `index.ts`
 * @param newDirectory 
 * @returns 
 */
function copyBarrelDescendantDirectoriesSync(filePath: string, newDirectory: string) {
	if (!filePath.includes('index.ts')) {
		return;
	}

	const directory = join(filePath, '..');
	try {
		fs.mkdirSync(newDirectory, {recursive: true});
	} catch (err) {
		console.error(err);
	}

	try {
		const files = fs.readdirSync(directory, {withFileTypes: true});
		files.forEach(file => {
			const source = join(directory, file.name);
			const destination = join(newDirectory, file.name);
			if (file.isDirectory()) {
				copyBarrelDescendantDirectoriesSync(source, destination);
			} else {
				fs.copyFileSync(source, destination);
			}
		});
	} catch (err) {
		console.error(err);
	}
}

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

	if (filePath.includes('index.ts')) {
		copyBarrelDescendantDirectoriesSync(filePath, destFileDir);
	}

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
