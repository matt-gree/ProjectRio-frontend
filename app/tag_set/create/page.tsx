'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { apiPost, getAllTags, getUserCommunities, TAG_ENDPOINTS } from '@/lib/api';
import { useTagsets } from '@/lib/useTagsets';
import { useUsername } from '@/lib/useUsername';
import { PageHeader } from '@/components/ui';

// The backend expects unix seconds shifted to US Eastern (UTC-4), matching the old site.
const TIMEZONE_OFFSET_SECONDS = 14400;

export default function CreateTagSetPage() {
	const username = useUsername();
	const tagsets = useTagsets();
	const [allTags, setAllTags] = useState<any[]>([]);
	const [communities, setCommunities] = useState<any[]>([]);

	const [name, setName] = useState('');
	const [desc, setDesc] = useState('');
	const [type, setType] = useState<'Season' | 'League' | 'Tournament'>('Season');
	const [communityName, setCommunityName] = useState('');
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [templateId, setTemplateId] = useState(0);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

	useEffect(() => {
		getAllTags().then(setAllTags).catch(() => {});
	}, []);

	useEffect(() => {
		if (!username) return;
		getUserCommunities(username)
			.then((result) => {
				setCommunities(result);
				if (result[0]?.name) setCommunityName(result[0].name);
			})
			.catch(() => {});
	}, [username]);

	function toggleTag(id: number) {
		setSelectedTags((current) =>
			current.includes(id) ? current.filter((t) => t !== id) : [...current, id]
		);
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setStatus('submitting');
		const body: any = {
			name,
			desc,
			type,
			community_name: communityName,
			tags: selectedTags,
			start_date: Math.floor(new Date(startDate).getTime() / 1000) + TIMEZONE_OFFSET_SECONDS,
			end_date: Math.floor(new Date(endDate).getTime() / 1000) + TIMEZONE_OFFSET_SECONDS
		};
		if (templateId > 0) body.tag_set_id = templateId;
		try {
			await apiPost(TAG_ENDPOINTS.CREATE_TAG_SET, body);
			setStatus('success');
		} catch {
			setStatus('error');
		}
	}

	if (status === 'success') {
		return (
			<div className="mx-auto max-w-lg">
				<div className="panel p-8 text-center">
					<h1 className="text-3xl uppercase">Game Mode Created</h1>
					<p className="mt-3 text-sm text-fog-300">“{name}” is live for your community.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl">
			<PageHeader kicker="Community" title="Create a Game Mode" />
			{!username && (
				<p className="mb-6 rounded-lg border border-star-500/40 bg-star-500/10 px-4 py-3 text-sm text-star-400">
					You need to be logged in to create a game mode for your community.
				</p>
			)}
			<form onSubmit={handleSubmit} className="panel space-y-5 p-6">
				<div className="grid gap-5 sm:grid-cols-2">
					<div>
						<label className="label" htmlFor="name">
							Name
						</label>
						<input
							id="name"
							className="input"
							required
							maxLength={100}
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</div>
					<div>
						<label className="label" htmlFor="type">
							Type
						</label>
						<select id="type" className="input" value={type} onChange={(event) => setType(event.target.value as any)}>
							<option value="Season">Season</option>
							<option value="League">League</option>
							<option value="Tournament">Tournament</option>
						</select>
					</div>
				</div>

				<div>
					<label className="label" htmlFor="community">
						Community
					</label>
					{communities.length > 0 ? (
						<select
							id="community"
							className="input"
							value={communityName}
							onChange={(event) => setCommunityName(event.target.value)}
						>
							{communities.map((community) => (
								<option key={community.name} value={community.name}>
									{community.name}
								</option>
							))}
						</select>
					) : (
						<input
							id="community"
							className="input"
							required
							placeholder="Community name"
							value={communityName}
							onChange={(event) => setCommunityName(event.target.value)}
						/>
					)}
				</div>

				<div>
					<label className="label" htmlFor="desc">
						Description
					</label>
					<textarea
						id="desc"
						className="input min-h-24"
						required
						maxLength={1000}
						value={desc}
						onChange={(event) => setDesc(event.target.value)}
					/>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					<div>
						<label className="label" htmlFor="start">
							Start Date
						</label>
						<input
							id="start"
							type="date"
							className="input"
							required
							value={startDate}
							onChange={(event) => setStartDate(event.target.value)}
						/>
					</div>
					<div>
						<label className="label" htmlFor="end">
							End Date
						</label>
						<input
							id="end"
							type="date"
							className="input"
							required
							value={endDate}
							onChange={(event) => setEndDate(event.target.value)}
						/>
					</div>
				</div>

				<div>
					<label className="label" htmlFor="template">
						Base on an existing game mode (optional)
					</label>
					<select
						id="template"
						className="input"
						value={templateId}
						onChange={(event) => setTemplateId(Number(event.target.value))}
					>
						<option value={0}>Start from scratch</option>
						{tagsets.map((tagset) => (
							<option key={tagset.id} value={tagset.id}>
								{tagset.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<span className="label">Game Tags</span>
					<div className="grid max-h-64 gap-1 overflow-y-auto rounded-lg border border-night-700 p-3 sm:grid-cols-2">
						{allTags
							.filter((tag) => tag.type !== 'Community' && tag.type !== 'Competition')
							.map((tag) => (
								<label key={tag.id} className="flex items-center gap-2 text-sm text-fog-300">
									<input
										type="checkbox"
										className="accent-rio-500"
										checked={selectedTags.includes(tag.id)}
										onChange={() => toggleTag(tag.id)}
									/>
									{tag.name}
								</label>
							))}
					</div>
				</div>

				{status === 'error' && (
					<p className="text-sm text-rio-300">
						Could not create the game mode. Make sure you are logged in and sponsor a community.
					</p>
				)}
				<button type="submit" className="btn-primary w-full" disabled={status === 'submitting'}>
					{status === 'submitting' ? 'Creating…' : 'Create Game Mode'}
				</button>
			</form>
		</div>
	);
}
