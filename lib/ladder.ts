export type Tier = 'Shell' | 'Mushroom' | 'Flower' | 'Star' | 'Special' | 'Legend';

const TIERS: Tier[] = ['Shell', 'Mushroom', 'Flower', 'Star', 'Special', 'Legend'];
const DIVISIONS = ['V', 'IV', 'III', 'II', 'I'];

// Tiers span 50-point divisions starting at 600; below 600 is Shell V, 2000+ is Legend I.
export function getTier(rating: number): string {
	if (rating < 600) return 'Shell V';
	if (rating >= 2000) return 'Legend I';
	const step = Math.floor((rating - 600) / 50) + 1;
	const tier = TIERS[Math.floor(step / 5)];
	return `${tier} ${DIVISIONS[step % 5]}`;
}

const TIER_COLORS: Record<Tier, string[]> = {
	Shell: ['#8bbf8c', '#a4cca5', '#bbdfba', '#d7ecd1', '#e6f0e1'],
	Mushroom: ['#ff4949', '#ff5a5a', '#f97979', '#ff8989', '#ffa9a9'],
	Flower: ['#ff6700', '#fb7216', '#ff8532', '#fd8f45', '#ffa162'],
	Star: ['#fff25c', '#fff476', '#fff68f', '#fff8a9', '#fffac2'],
	Special: ['#775587', '#8c679c', '#9d7bae', '#bf9ece', '#e0c5f0'],
	Legend: ['#af9146', '#c5a34f', '#dbb658', '#debd68', '#e2c479']
};

const ROMAN_TO_INT: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

export function getTierColor(rating: number): string {
	const [tierName, division] = getTier(rating).split(' ');
	return TIER_COLORS[tierName as Tier][(ROMAN_TO_INT[division] ?? 1) - 1];
}
