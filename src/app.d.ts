declare global {
	namespace App {
		interface Locals {
			user?: {
				id: string;
				email: string;
				name: string;
				image?: string | null;
				emailVerified: boolean;
				createdAt: Date;
				updatedAt: Date;
				isAnonymous?: boolean | null;
				learn_session_started_at?: Date | null;
			};
			session?: {
				id: string;
				userId: string;
				expiresAt: Date;
				token: string;
				ipAddress?: string | null;
				userAgent?: string | null;
				createdAt: Date;
				updatedAt: Date;
			};
		}
	}
}

export {};
