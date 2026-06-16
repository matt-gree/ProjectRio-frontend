import { redirect } from 'next/navigation';

// Legacy route — game mode list now lives at /modes.
export default function TagSetListPage() {
	redirect('/modes');
}
