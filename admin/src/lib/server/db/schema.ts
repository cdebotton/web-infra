import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey().notNull(),
		email: text('email').notNull().unique(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		displayName: text('display_name').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
	},
	(t) => [index('email_idx').on(t.email)]
);

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const documents = sqliteTable(
	'documents',
	{
		id: text('id').primaryKey().notNull(),
		slug: text('slug').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
	},
	(t) => {
		return [index('slug_idx').on(t.slug)];
	}
);

export type Document = InferSelectModel<typeof documents>;
export type InsertDocument = InferInsertModel<typeof documents>;

// Add document versions that refernece r2 key
