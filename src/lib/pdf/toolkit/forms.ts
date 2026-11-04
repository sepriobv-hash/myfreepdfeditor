import {
  checkCancelled,
  checkFont,
  documentFont,
  fileBase,
  pdfOutput,
  type Job,
} from "./core";
export type FormField = {
  name: string;
  kind: "text" | "check" | "choice";
  value: string | boolean | string[];
  options?: string[];
  multiple?: boolean;
  readOnly: boolean;
  maxLength?: number;
};
export async function inspectForm(bytes: ArrayBuffer): Promise<FormField[]> {
  const lib = await import("pdf-lib");
  const pdf = await lib.PDFDocument.load(bytes.slice(0));
  if (pdf.getPageCount() > 100) throw new Error("LIMIT");
  const form = pdf.getForm();
  if (form.hasXFA()) throw new Error("UNSUPPORTED_FORM");
  return form.getFields().flatMap((field): FormField[] => {
    const base = { name: field.getName(), readOnly: field.isReadOnly() };
    if (field instanceof lib.PDFTextField)
      return [
        {
          ...base,
          kind: "text",
          value: field.getText() ?? "",
          maxLength: field.getMaxLength(),
        },
      ];
    if (field instanceof lib.PDFCheckBox)
      return [{ ...base, kind: "check", value: field.isChecked() }];
    if (field instanceof lib.PDFDropdown || field instanceof lib.PDFOptionList)
      return [
        {
          ...base,
          kind: "choice",
          value: field.getSelected(),
          options: field.getOptions(),
          multiple: field.isMultiselect(),
        },
      ];
    if (field instanceof lib.PDFRadioGroup)
      return [
        {
          ...base,
          kind: "choice",
          value: field.getSelected() ? [field.getSelected()!] : [],
          options: field.getOptions(),
        },
      ];
    return [];
  });
}
export async function fillForm(
  bytes: ArrayBuffer,
  name: string,
  fields: FormField[],
  flatten: boolean,
  job: Job,
) {
  const lib = await import("pdf-lib");
  const pdf = await lib.PDFDocument.load(bytes.slice(0));
  const form = pdf.getForm();
  if (form.hasXFA()) throw new Error("UNSUPPORTED_FORM");
  const font = await documentFont(pdf);
  for (let i = 0; i < fields.length; i++) {
    checkCancelled(job.signal);
    const entry = fields[i];
    if (entry.readOnly) continue;
    const field = form.getField(entry.name);
    if (field instanceof lib.PDFTextField) {
      checkFont(font, String(entry.value));
      field.setText(String(entry.value));
      field.updateAppearances(font);
    } else if (field instanceof lib.PDFCheckBox) {
      if (entry.value) field.check();
      else field.uncheck();
    } else if (
      field instanceof lib.PDFDropdown ||
      field instanceof lib.PDFOptionList
    ) {
      field.clear();
      if (Array.isArray(entry.value) && entry.value.length)
        field.select(entry.value);
    } else if (field instanceof lib.PDFRadioGroup) {
      field.clear();
      if (Array.isArray(entry.value) && entry.value.length)
        field.select(entry.value[0]);
    }
    job.progress(((i + 1) / fields.length) * 95);
  }
  form.updateFieldAppearances(font);
  if (flatten) {
    // pdf-lib 1.17.1 removes appearance references instead of widget references
    // from Annots. Retain actual widget refs before flatten deletes their objects.
    const widgets = form
      .getFields()
      .flatMap((field) =>
        field.acroField
          .getWidgets()
          .map((widget) => pdf.context.getObjectRef(widget.dict)),
      );
    form.flatten({ updateFieldAppearances: false });
    for (const page of pdf.getPages())
      for (const ref of widgets) if (ref) page.node.removeAnnot(ref);
    form.acroForm.dict.delete(lib.PDFName.of("CO"));
  }
  job.progress(100);
  return pdfOutput(await pdf.save(), `${fileBase(name)}-filled.pdf`);
}
