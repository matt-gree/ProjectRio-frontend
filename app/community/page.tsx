import Link from 'next/link';
import { PageHeader } from '@/components/ui';

export const metadata = { title: 'Community' };

const CARDS = [
	{
		href: '/community/create',
		title: 'Create a Community',
		description: 'Start a community for your league, region, or friend group.'
	},
	{
		href: '/tag_set/create',
		title: 'Create a Game Mode',
		description: 'Set up a custom ruleset and ladder for your community.'
	},
	{
		href: '/users/community',
		title: 'Find Communities',
		description: 'Look up which communities a player belongs to.'
	},
	{
		href: '/tags',
		title: 'Browse Game Tags',
		description: 'All rule tags and gecko codes available for game modes.'
	}
];

export default function CommunityPage() {
	return (
		<div>
			<PageHeader kicker="Play together" title="Community" />
			<div className="grid gap-4 sm:grid-cols-2">
				{CARDS.map((card) => (
					<Link key={card.href} href={card.href} className="panel panel-glow block p-6">
						<h2 className="font-display text-xl font-bold uppercase tracking-wide">{card.title}</h2>
						<p className="mt-2 text-sm text-fog-500">{card.description}</p>
					</Link>
				))}
			</div>
			<div className="panel mt-8 p-6 text-center">
				<p className="text-sm text-fog-300">
					Looking for opponents? The fastest way to find games is the{' '}
					<a
						href="https://discord.gg/c3r9PabfRU"
						target="_blank"
						rel="noreferrer"
						className="text-rio-400 hover:text-rio-300"
					>
						Project Rio Discord
					</a>
					.
				</p>
			</div>
		</div>
	);
}
