'use client';

import { useEffect, useState } from 'react';
import { getAllTagSets, type TagSet } from './api';

// Tag sets rarely change; cache them for the lifetime of the tab.
let cache: TagSet[] | null = null;
let pending: Promise<TagSet[]> | null = null;

export function useTagsets(): TagSet[] {
	const [tagsets, setTagsets] = useState<TagSet[]>(cache ?? []);

	useEffect(() => {
		if (cache) return;
		pending ??= getAllTagSets().then((result) => {
			cache = result;
			return result;
		});
		let cancelled = false;
		pending.then((result) => {
			if (!cancelled) setTagsets(result);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return tagsets;
}
