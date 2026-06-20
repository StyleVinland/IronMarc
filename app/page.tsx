import { getFullState } from '@/lib/db';
import DashboardClient from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const state = getFullState();
  return <DashboardClient initialState={state} />;
}
