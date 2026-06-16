'use client';

import { useEffect, useState } from 'react';
import { getRecentGames, type GameSummary } from '@/lib/api';
import { useTagsets } from '@/lib/useTagsets';
import GameCard from '@/components/GameCard';
import { PageHeader, Spinner, EmptyState, ErrorState } from '@/components/ui';

const REFRESH_MS = 30_000;

export default function RecentGamesPage() {
	const [games, setGames] = useState<GameSummary[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [limit, setLimit] = useState(24);
	const tagsets = useTagsets();

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const result = await getRecentGames({ limit });
				if (!cancelled) {
					setGames(result);
					setError(null);
				}
			} catch {
				if (!cancelled) setError('Could not load recent games. Retrying shortly…');
			}
		}

		load();
		const interval = setInterval(load, REFRESH_MS);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, [limit]);

	return (
		<div>
			<PageHeader kicker="Around the league" title="Recent Games">
				<label className="flex items-center gap-2 text-sm text-fog-300">
					Show
					<select
						className="input !w-auto"
						value={limit}
						onChange={(event) => setLimit(Number(event.target.value))}
					>
						{[12, 24, 48, 96].map((n) => (
							<option key={n} value={n}>
								{n} games
							</option>
						))}
					</select>
				</label>
			</PageHeader>

			{error && <ErrorState message={error} />}
			{games === null && !error && <Spinner label="Loading recent games…" />}
			{games !== null && games.length === 0 && (
				<EmptyState title="No recent games" detail="Games will appear here as soon as they are played." />
			)}
			{games !== null && games.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{games.map((game) => (
						<GameCard key={game.game_id} game={game} tagsets={tagsets} />
					))}
				</div>
			)}
		</div>
	);
}
