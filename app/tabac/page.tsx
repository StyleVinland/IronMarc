import { getFullState } from '@/lib/db';
import TabacClient from '@/components/TabacClient';

export const dynamic = 'force-dynamic';

export default function TabacPage() {
  const state = getFullState();
  return <TabacClient initialState={state} />;
}
