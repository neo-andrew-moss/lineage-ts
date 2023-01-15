import { pipe } from "lodash/fp";
import { copyFiles } from "./util";

export const copyDescendantImports = (
  imports: Object,
  destination?: string
) => {
  if (!destination) {
    throw new Error("destination not specified");
  }

  const res: string[] = pipe(Object.fromEntries, Object.keys)(imports);

  copyFiles(res, destination);
};
