import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND, USER_ENDPOINTS } from '@/lib/api';

export async function POST() {
	const cookieStore = await cookies();
	if (cookieStore.get('jwt')) {
		// Best effort — the cookie is cleared regardless of backend response.
		try {
			await fetch(BACKEND + USER_ENDPOINTS.LOGOUT);
		} catch {
			// ignore
		}
		cookieStore.delete('jwt');
	}
	return NextResponse.json({ success: true });
}
