import * as fs from 'fs';
import * as path from 'path';

/**
 * This is not working quite right
 * @param filePaths 
 * @param destination 
 */
export const copyFiles = (filePaths: string[], destination: string) => {
    filePaths.map(filePath => {
        const relativePath = path.relative(path.dirname(filePath), filePath);
        const destinationPath = path.join(destination, relativePath);
        const destinationFolder = path.dirname(destinationPath);
        if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true });
        }
        fs.copyFileSync(filePath, destinationPath);
    });
}