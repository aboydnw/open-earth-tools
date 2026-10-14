import { Directory } from '@/components/Directory';
import { suggestionsSiteKey, workerEnv } from '@/lib/cloudflare';
import { listTools } from '@/lib/tools-repo';
import { listCategories } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tools = await listTools(workerEnv.DB);

  return (
    <Directory
      tools={tools}
      categories={['All', ...listCategories(tools)]}
      isAdmin={false}
      turnstileSiteKey={suggestionsSiteKey()}
    />
  );
}
