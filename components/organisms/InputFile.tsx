"use client";

import { parsePdf } from "@/app/actions/parsePDF";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ComponentProps } from "react";
import { Document } from "@/app/types/chat";

interface InputFileInterface extends ComponentProps<'input'>{
  setDocument: (doc: Document) => void;
}

export function InputFile({ setDocument, ref, className }: InputFileInterface): React.ReactElement {
  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    const file = files ? files[0] : null;

    if (!file) return;

    const doc = await parsePdf(file);
    const id = crypto.randomUUID();
    setDocument({id: id,name: file.name, content: doc});
  };


  return (
    <Field className={className}>
      <Input ref={ref} accept="application/pdf" type="file" onChange={handleChangeFile} />
      <FieldDescription>Select a PDF file to upload.</FieldDescription>
    </Field>
  );
}
