import { NodePath } from "@babel/traverse";
import { I18nOptions } from "./options";

export interface TransformResult {
  needTransform: boolean;
}

export function i18nImportAstTransform(
  programPath: NodePath,
  importName: string,
  importAs: string,
  importPath: string
): TransformResult;

export function babelI18nImportTransform(
  programPath: NodePath,
  options: Partial<I18nOptions>,
  state: any
): boolean;
