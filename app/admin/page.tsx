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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Not authorized</h1>
          <p className="text-gray-600 text-sm">Sign in through Cloudflare Access to edit the directory.</p>
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
