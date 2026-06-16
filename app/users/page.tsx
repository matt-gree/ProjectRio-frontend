'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAllUsers } from '@/lib/api';
import { PageHeader, Spinner, ErrorState } from '@/components/ui';

export default function UsersPage() {
	const [users, setUsers] = useState<string[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState('');

	useEffect(() => {
		getAllUsers()
			.then((result) => setUsers([...result].sort((a, b) => a.localeCompare(b))))
			.catch(() => setError('Could not load the player list.'));
	}, []);

	const filtered = useMemo(
		() => (users ?? []).filter((user) => user.toLowerCase().includes(query.toLowerCase())),
		[users, query]
	);

	return (
		<div>
			<PageHeader kicker="Player directory" title="Players">
				<input
					type="search"
					className="input !w-64"
					placeholder="Search players…"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
			</PageHeader>

			{error && <ErrorState message={error} />}
			{!users && !error && <Spinner label="Loading players…" />}
			{users && (
				<>
					<p className="mb-4 text-sm text-fog-500">
						{filtered.length} of {users.length} players
					</p>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
						{filtered.map((user) => (
							<Link
								key={user}
								href={`/users/${encodeURIComponent(user)}`}
								className="panel panel-glow truncate px-4 py-3 text-sm font-medium text-fog-100"
							>
								{user}
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	);
}
