import { FormFillPage } from "@/src/components/FormFillPage";

export default async function FillFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FormFillPage formId={id} />;
}
