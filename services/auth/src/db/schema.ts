import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey().notNull(),
		email: text('email').notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	},
	(t) => [index('email_idx').on(t.email)],
);

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferSelectModel<typeof users>;

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	tokenFamily: text('token_family').notNull(),
	deviceInfo: text('device_info'),
	ipAddress: text('ip_address'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	lastUsedAt: integer('last_used_at', { mode: 'timestamp_ms' }).notNull(),
});

export type Session = InferSelectModel<typeof sessions>;
export type InsertSession = InferInsertModel<typeof sessions>;
