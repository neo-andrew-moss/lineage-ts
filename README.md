# `lineage-ts`

> CLI to identify all descendant imports of a ts file

[![NPM](https://img.shields.io/npm/v/lineage-ts?style=for-the-badge)](https://www.npmjs.com/package/lineage-ts)

## Highlights

- :checkered_flag: **Fast** - Uses `ts-morph` to analyze the AST import specifiers of a typescript project
- :large_blue_circle: **.ts**
- :see_no_evil: **Omits imports from `node_modules` and just picks up your source code**
- :evergreen_tree: **`cp` the resolved tree** - Optionally copies the resolved import tree to a new directory for analysis or refactoring. The original relative directory structure is retained
- :wrench: **Configurable** - Functionality for complicated typescript projects and use cases

## About

`ts-lineage` takes a typescript file, extracts its dependencies via [ts-morph](https://github.com/dependents/node-precinct/), resolves each relative import to a file on the filesystem, then "recursively" performs those steps on the descendant imports until all relative imports are resolved.

## Installation

```bash
npm install lineage-ts
```

## Options

- `-f, --file <string>`(required): path to the root file)
- `-tsc, --tsconfig <string>`(optional): path to a typescript config
- `-dir, --destDir <string>`(optional): directory to copy the resolved dependency tree to
- `-dbg, debug <boolean>`(optional): Run in debug mode

## Use cases

- Debugging and performance testing: When analyzing a single element in a large application, it can be useful to extract only the relevant code to remove any potential side effects and complications from the main app.
- Refactoring: When moving an application to a new architecture, it can be cumbersome to manually `cp` over files that relate to the refactor target.

## Prior Art

- [node-dependency-tree](https://github.com/dependents/node-dependency-tree)

`node-dependency-tree` is a generic tool for analyzing dependencies that works for multiple languages and module types. `lineage-ts` is exclusively for typescript, uses `ts-morph`, and has a utility for `cp`'ing the resolved dependency tree to a new `dir`

## Help

```bash
lineage-ts --help
```
