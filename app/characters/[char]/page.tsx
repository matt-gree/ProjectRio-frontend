import Link from 'next/link';
import { notFound } from 'next/navigation';
import { characters, characterClasses, characterImage } from '@/lib/data/characters';
import { PageHeader, Badge } from '@/components/ui';

export function generateStaticParams() {
	return Object.values(characters).map((char) => ({ char }));
}

export default async function CharacterPage({ params }: { params: Promise<{ char: string }> }) {
	const char = decodeURIComponent((await params).char);
	const info = characterClasses[char];
	if (!info) notFound();

	return (
		<div className="space-y-8">
			<PageHeader kicker="Character" title={char}>
				<Link href={`/characters/${encodeURIComponent(char)}/batting`} className="btn-primary text-sm">
					Batting Stats
				</Link>
				<Link href={`/characters/${encodeURIComponent(char)}/pitching`} className="btn-secondary text-sm">
					Pitching Stats
				</Link>
			</PageHeader>

			<div className="panel flex items-center gap-6 p-6">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={characterImage(char)} alt={char} className="h-24 w-24 object-contain" />
				<div>
					<Badge color="red">{info.Class}</Badge>
					<p className="mt-3 max-w-xl text-sm text-fog-500">
						Community-wide batting and pitching performance for {char} across every recorded ranked game.
						Pick a stat page above to see who plays {char} best.
					</p>
				</div>
			</div>
		</div>
	);
}
