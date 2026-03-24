import { auth } from '$lib/server/auth/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import { startAnonymousCleanup } from '$lib/server/cleanup-anonymous';

export async function init() {
	if (building) return;
	startAnonymousCleanup();
}

const PUBLIC_ROUTES = new Set(['/auth', '/diagnostic', '/visual', '/up']);
const ANON_BOOTSTRAP_ROUTES = new Set(['/diagnostic', '/visual']);

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (
		path === '/' ||
		path === '/up' ||
		path.startsWith('/api/auth') ||
		path.startsWith('/_app/') ||
		path === '/favicon.ico' ||
		/\.(?:css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|map|txt)$/i.test(path)
	) {
		return svelteKitHandler({ event, resolve, auth, building });
	}

	const headers = new Headers(event.request.headers);
	headers.set(
		'cookie',
		event.cookies
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join('; ')
	);

	let session = await auth.api.getSession({ headers });

	if (!session && ANON_BOOTSTRAP_ROUTES.has(path)) {
		await auth.api.signInAnonymous({ headers });
		// Re-read cookies after signInAnonymous set the session cookie via sveltekitCookies
		const freshHeaders = new Headers(event.request.headers);
		freshHeaders.set(
			'cookie',
			event.cookies
				.getAll()
				.map((c) => `${c.name}=${c.value}`)
				.join('; ')
		);
		session = await auth.api.getSession({ headers: freshHeaders });
	}

	event.locals.session = session?.session;
	event.locals.user = session?.user;

	if (path === '/auth' && session && !session.user.isAnonymous) {
		redirect(303, '/learn');
	}

	if (!PUBLIC_ROUTES.has(path) && (!session || session.user.isAnonymous)) {
		redirect(303, `/auth?redirectTo=${encodeURIComponent(path)}`);
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
