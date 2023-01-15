import {
  Project,
  type ImportDeclaration,
  SyntaxKind,
  type SourceFile,
} from "ts-morph";
import compact from "lodash/compact";
import { dbg } from "./util";

type Map1 = Map<string, Map1>;

/**
 * @note I created this to avoid recursion. It is highly impure and mutable. Not a fam.
 * @param sourceFile
 * @param project
 * @returns
 */
function getImportsFromSourceFileAlt(sourceFile: SourceFile, project: Project) {
  const imports: Map1 = new Map<string, Map<string, Map1>>();
  const queue = [sourceFile];

  while (queue.length > 0) {
    const currentFile = queue.pop();

    if (!currentFile) {
      break;
    }

    if (!imports.has(currentFile.getFilePath())) {
      imports.set(currentFile.getFilePath(), new Map<string, Map1>());
    }

    currentFile
      .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
      .filter((node) => node.isModuleSpecifierRelative())
      .forEach((node: ImportDeclaration) => {
        const nodeSourceFile = node.getModuleSpecifierSourceFile();
        if (!nodeSourceFile) {
          return;
        }

        const importedFilePath = nodeSourceFile.getFilePath();
        if (!imports.has(importedFilePath)) {
          imports.set(importedFilePath, new Map<string, Map1>());
          queue.push(project.getSourceFile(importedFilePath)!);
        }

        imports
          .get(currentFile.getFilePath())!
          .set(importedFilePath, new Map());
      });
  }

  return imports;
}

type ImportTree = Array<{
  name: string;
  children: ImportTree;
}>;

/**
 * @note While this does work. The depth of the descendants dictates the call stack size as this is recursive. This can lead to `RangeError: Maximum call stack size exceeded` for large import structures.
 * @param sourceFile
 * @returns
 */
const getImportsFromSourceFile = (sourceFile: SourceFile): ImportTree => {
  const imports = sourceFile
    .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
    .filter((node) => node.isModuleSpecifierRelative())
    .map((node: ImportDeclaration) => {
      const next = node.getModuleSpecifierSourceFile();

      if (!next) {
        console.warn(
          `Unable to find module specifier for filePath:${sourceFile.getFilePath()}  import: ${node.getModuleSpecifierValue()}`
        );
        return undefined;
      }

      return {
        name: node.getModuleSpecifierValue(),
        // This level of recursion is highly problematic
		// eslint-skip-next-line
        children: getImportsFromSourceFile(next),
      };
    });

  return compact(imports);
};

export const findDescendantImports = (filePath: string, tsConfigPath?:string): ImportTree => {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    tsConfigFilePath:
    tsConfigPath,
  });
  project.addSourceFileAtPath(filePath);
  const sourceFile = project.getSourceFile(filePath);

  if (!sourceFile) {
    throw new Error("entrypoint not found");
  }

  const f = getImportsFromSourceFileAlt(sourceFile, project);
  dbg(f);
  return getImportsFromSourceFile(sourceFile);
};
