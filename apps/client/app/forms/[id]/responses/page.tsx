import { FormResponsesPage } from "@/src/components/FormResponsesPage";

export default async function FormResponsesRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FormResponsesPage formId={id} />;
}
