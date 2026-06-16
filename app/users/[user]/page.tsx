'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentGames, type GameSummary } from '@/lib/api';
import { winLossRecord } from '@/lib/time';
import { useTagsets } from '@/lib/useTagsets';
import GameCard from '@/components/GameCard';
import { PageHeader, Spinner, EmptyState, Badge } from '@/components/ui';

export default function UserPage({ params }: { params: Promise<{ user: string }> }) {
	const user = decodeURIComponent(use(params).user);
	const [games, setGames] = useState<GameSummary[] | null>(null);
	const tagsets = useTagsets();

	useEffect(() => {
		let cancelled = false;
		getRecentGames({ limit: 10, username: user })
			.then((result) => {
				if (!cancelled) setGames(result);
			})
			.catch(() => {
				if (!cancelled) setGames([]);
			});
		return () => {
			cancelled = true;
		};
	}, [user]);

	const record = games ? winLossRecord(games, user) : null;

	return (
		<div className="space-y-8">
			<PageHeader kicker="Player profile" title={user}>
				<Link href={`/users/${encodeURIComponent(user)}/batting`} className="btn-secondary text-sm">
					Batting Stats
				</Link>
				<Link href={`/users/${encodeURIComponent(user)}/pitching`} className="btn-secondary text-sm">
					Pitching Stats
				</Link>
			</PageHeader>

			{record && games && games.length > 0 && (
				<div className="flex items-center gap-3">
					<Badge color={record[0] >= record[1] ? 'green' : 'red'}>
						Last {games.length}: {record[0]}–{record[1]}
					</Badge>
				</div>
			)}

			<section>
				<h2 className="kicker mb-4">Recent Games</h2>
				{games === null && <Spinner label="Loading games…" />}
				{games !== null && games.length === 0 && (
					<EmptyState title="No games found" detail="This player has no recorded games yet." />
				)}
				{games !== null && games.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{games.map((game) => (
							<GameCard key={game.game_id} game={game} tagsets={tagsets} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
