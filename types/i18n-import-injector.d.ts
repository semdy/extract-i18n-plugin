import { NodePath } from "@babel/traverse";
import { I18nOptions } from "./options";

export interface TransformResult {
  needTransform: boolean;
}

export function injectI18nImport(
  programPath: NodePath,
  importName: string,
  importAs: string,
  importPath: string
): TransformResult;

export function batchInjectI18nImport(
  programPath: NodePath,
  options: Partial<I18nOptions>,
  state: any
): boolean;
