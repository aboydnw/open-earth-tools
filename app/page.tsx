import { Directory } from '@/components/Directory';
import { getSubmissionConfig } from '@/lib/submissions/config';
import { listCategories, loadTools } from '@/lib/tools-data';

export default function Home() {
  const tools = loadTools();
  const turnstileSiteKey = getSubmissionConfig()?.turnstileSiteKey ?? null;

  return (
    <Directory
      tools={tools}
      categories={['All', ...listCategories(tools)]}
      turnstileSiteKey={turnstileSiteKey}
    />
  );
}
