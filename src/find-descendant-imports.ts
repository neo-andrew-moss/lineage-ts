import {Project, type ImportDeclaration, SyntaxKind} from 'ts-morph';
import compact from 'lodash/compact';

type ImportTree = Array<{
	name: string;
	children: ImportTree;
}>;

export const findDescendantImports = (filePath: string): ImportTree => {
	const project = new Project({skipAddingFilesFromTsConfig: false});
	project.addSourceFileAtPath(filePath);
	const sourceFile = project.getSourceFile(filePath);

	if (!sourceFile) {
		throw new Error('entrypoint not found');
	}

	const imports = sourceFile
		.getDescendantsOfKind(SyntaxKind.ImportDeclaration)
		.map((node: ImportDeclaration) => {
			if (node.isModuleSpecifierRelative()) {
				return {
					name: node.getModuleSpecifierValue(),
					children: findDescendantImports(
						node.getModuleSpecifierSourceFileOrThrow().getFilePath(),
					),
				};
			}

			return undefined;
		});

	return compact(imports);
};
