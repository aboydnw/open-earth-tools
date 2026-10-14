import { headers } from 'next/headers';
import { Directory } from '@/components/Directory';
import { isAdminRequest } from '@/lib/admin/access';
import { workerEnv } from '@/lib/cloudflare';
import { listSuggestions } from '@/lib/suggestions';
import { listTools } from '@/lib/tools-repo';
import { listCategories } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  if (!(await isAdminRequest(await headers(), workerEnv))) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper p-8">
        <div className="max-w-md border border-ink bg-sheet p-6 text-center">
          <h1 className="font-wide mb-2 text-2xl font-[520] tracking-[-0.02em]">Not authorized</h1>
          <p className="text-sm text-slate">Sign in through Cloudflare Access to edit the directory.</p>
        </div>
      </main>
    );
  }

  const [tools, suggestions] = await Promise.all([
    listTools(workerEnv.DB),
    listSuggestions(workerEnv.DB),
  ]);

  return (
    <Directory
      tools={tools}
      categories={['All', ...listCategories(tools)]}
      isAdmin
      suggestions={suggestions}
    />
  );
}
