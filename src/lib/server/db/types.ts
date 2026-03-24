import type { ColumnType, Selectable } from 'kysely';

export interface UserTable {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: ColumnType<Date, string | Date | undefined, never>;
	updatedAt: ColumnType<Date, string | Date, string | Date>;
	isAnonymous: boolean;
	learn_session_started_at: ColumnType<Date | null, string | Date | null, string | Date | null>;
}

export interface SessionTable {
	id: string;
	expiresAt: Date;
	token: string;
	createdAt: ColumnType<Date, string | Date | undefined, never>;
	updatedAt: ColumnType<Date, string | Date, string | Date>;
	ipAddress: string | null;
	userAgent: string | null;
	userId: string;
}

export interface AccountTable {
	id: string;
	accountId: string;
	providerId: string;
	userId: string;
	accessToken: string | null;
	refreshToken: string | null;
	idToken: string | null;
	accessTokenExpiresAt: Date | null;
	refreshTokenExpiresAt: Date | null;
	scope: string | null;
	password: string | null;
	createdAt: ColumnType<Date, string | Date | undefined, never>;
	updatedAt: ColumnType<Date, string | Date, string | Date>;
}

export interface VerificationTable {
	id: string;
	identifier: string;
	value: string;
	expiresAt: Date;
	createdAt: ColumnType<Date, string | Date | undefined, never>;
	updatedAt: ColumnType<Date, string | Date, string | Date>;
}

export interface LearningLogTable {
	id: string;
	user_id: string;
	topic_id: string;
	grade: number;
	elapsed_days: number;
	scheduled_days: number;
	state: number;
	created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface TopicStateTable {
	user_id: string;
	topic_id: string;
	stability: number;
	difficulty: number;
	last_review: ColumnType<Date, string | Date, string | Date>;
	due_date: ColumnType<Date, string | Date, string | Date>;
	state: number;
	reps: number;
	lapses: number;
	scheduled_days: number;
	learning_steps: number;
}

export interface TopicTable {
	id: string;
	title: string;
	problems: unknown;
	rendered_problems: unknown;
	depth: number;
	topological_rank: number;
	is_milestone: boolean;
	lesson_markdown: string | null;
	lesson_slides: unknown;
	created_at: ColumnType<Date, string | Date | undefined, never>;
	updated_at: ColumnType<Date, string | Date, string | Date>;
}

export interface TopicPrerequisiteTable {
	from_topic_id: string;
	to_topic_id: string;
	weight: number;
}

export interface Database {
	user: UserTable;
	session: SessionTable;
	account: AccountTable;
	verification: VerificationTable;

	learning_log: LearningLogTable;
	topic_state: TopicStateTable;

	topic: TopicTable;
	topic_prerequisite: TopicPrerequisiteTable;
}

export type LearningLog = Selectable<LearningLogTable>;
export type TopicState = Selectable<TopicStateTable>;
