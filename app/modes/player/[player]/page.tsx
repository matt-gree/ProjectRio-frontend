import { redirect } from 'next/navigation';

// Legacy route — player game history now lives on the user profile.
export default async function LegacyPlayerPage({ params }: { params: Promise<{ player: string }> }) {
	const { player } = await params;
	redirect(`/users/${player}`);
}
