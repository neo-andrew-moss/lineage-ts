import {
  Project,
  type ImportDeclaration,
  SyntaxKind,
  SourceFile,
} from "ts-morph";
import compact from "lodash/compact";
import { dbg } from "./util";

function getImportsFromSourceFileAlt(sourceFile: SourceFile, project: Project) {
  const imports = new Map<string, Map<string, unknown>>();
  const queue = [sourceFile];

  while (queue.length > 0) {
    const currentFile = queue.pop();

    if (!currentFile) {
      break;
    }

    if (!imports.has(currentFile.getFilePath())) {
      imports.set(currentFile.getFilePath(), new Map<string, unknown>());
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
          imports.set(importedFilePath, new Map<string, unknown>());
          queue.push(project.getSourceFile(importedFilePath)!);
        }
        imports.get(currentFile.getFilePath())!.set(importedFilePath, {});
      });
  }

  return imports;
}

type ImportTree = Array<{
  name: string;
  children: ImportTree;
}>;

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
        children: getImportsFromSourceFile(next),
      };
    });

  return compact(imports);
};

export const findDescendantImports = (filePath: string): ImportTree => {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    tsConfigFilePath: "TODO: API this",
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
