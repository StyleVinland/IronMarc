import { getFullState } from '@/lib/db';
import MentalClient from '@/components/MentalClient';

export const dynamic = 'force-dynamic';

export default function MentalPage() {
  const state = getFullState();
  return <MentalClient initialState={state} />;
}
