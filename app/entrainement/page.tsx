import { getFullState } from '@/lib/db';
import EntrainementClient from '@/components/EntrainementClient';

export const dynamic = 'force-dynamic';

export default function EntrainementPage() {
  const state = getFullState();
  return <EntrainementClient initialState={state} />;
}
