'use client';

import { useEffect, useState } from 'react';
import { getRecentGames, type GameSummary } from '@/lib/api';
import { useTagsets } from '@/lib/useTagsets';
import GameCard from './GameCard';
import { Spinner } from './ui';

export default function LatestGames({ count = 6 }: { count?: number }) {
	const [games, setGames] = useState<GameSummary[] | null>(null);
	const tagsets = useTagsets();

	useEffect(() => {
		let cancelled = false;
		getRecentGames({ limit: count })
			.then((result) => {
				if (!cancelled) setGames(result);
			})
			.catch(() => {
				if (!cancelled) setGames([]);
			});
		return () => {
			cancelled = true;
		};
	}, [count]);

	if (games === null) return <Spinner label="Loading latest games…" />;
	if (games.length === 0) {
		return <p className="py-8 text-center text-sm text-fog-500">Could not load games right now — check back in a minute.</p>;
	}
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{games.map((game) => (
				<GameCard key={game.game_id} game={game} tagsets={tagsets} />
			))}
		</div>
	);
}
