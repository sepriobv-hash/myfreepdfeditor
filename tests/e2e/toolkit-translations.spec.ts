import { test, expect } from "@playwright/test";
import ts from "typescript";
import { readFileSync } from "node:fs";
import { additionalToolContent } from "../../src/lib/additionalPdfTools";
import { dictionaries } from "../../src/lib/translations";

test("every new tool, error and output message has all five translations", () => {
  const keys = new Set<string>();
  const strings = (node: ts.Node) => {
    if (ts.isStringLiteral(node)) keys.add(node.text);
    else ts.forEachChild(node, strings);
  };
  for (const path of [
    "src/components/tools/workflows/ToolkitPanel.tsx",
    "src/components/tools/workflows/PdfPreview.tsx",
    "src/components/tools/CompressPdfPanel.tsx",
    "src/lib/pdf/toolkit/core.ts",
    "src/lib/pdf/toolkit/ocr.ts",
    "src/lib/pdf/toolkit/office.ts",
  ]) {
    const source = ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "t" &&
        node.arguments[0]
      )
        strings(node.arguments[0]);
      if (
        ts.isPropertyAssignment(node) &&
        node.name.getText(source) === "message"
      )
        strings(node.initializer);
      if (ts.isFunctionDeclaration(node) && node.name?.text === "errorKey") {
        const errors = (part: ts.Node) => {
          if (ts.isStringLiteral(part) && part.text.includes(" "))
            keys.add(part.text);
          else ts.forEachChild(part, errors);
        };
        errors(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  for (const tool of additionalToolContent)
    for (const key of [
      "name",
      "intro",
      "example",
      "limit",
      "action",
      "category",
    ] as const)
      keys.add(tool[key]);
  // Runtime path/name values are not translation keys.
  for (const key of [...keys])
    if (
      [
        "crop",
        "redact",
        "forms",
        "images-to-pdf",
        "pdf-to-word",
        "text",
        "images",
      ].includes(key)
    )
      keys.delete(key);
  for (const locale of ["nl", "de", "fr", "es", "it"] as const) {
    const dictionary: Record<string, string> = dictionaries[locale];
    for (const key of keys)
      expect(dictionary[key], `${locale}: ${key}`).toBeTruthy();
  }
});
