import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND, USER_ENDPOINTS } from '@/lib/api';

const WEEK_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
	const body = await request.json();

	const response = await fetch(BACKEND + USER_ENDPOINTS.LOGIN, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ Email: body.Email, Password: body.Password })
	});

	if (!response.ok) {
		return NextResponse.json({ error: 'Login failed' }, { status: response.status });
	}

	const result = await response.json();
	if (result.access_token) {
		(await cookies()).set('jwt', result.access_token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: WEEK_SECONDS
		});
	}

	return NextResponse.json({ username: result.username ?? null, msg: result.msg ?? null });
}
