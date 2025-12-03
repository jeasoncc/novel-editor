import { DocsLayout } from "@/components/docs/docs-layout";

export default function DocsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout>{children}</DocsLayout>;
}

