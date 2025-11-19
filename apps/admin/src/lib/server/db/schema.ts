import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey().notNull(),
		email: text('email').notNull().unique(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		avatarId: text('avatar_id').references(() => assets.id, { onDelete: 'set null' }),
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
		slug: text('slug').unique().notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		publishDate: integer('publish_date', { mode: 'timestamp_ms' }),
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

export const documentVersions = sqliteTable('document_versions', {
	id: text('id').primaryKey().notNull(),
	documentId: text('document_id')
		.references(() => documents.id, { onDelete: 'cascade' })
		.notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	key: text('key').unique(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixephic() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export type DocumentVersion = InferSelectModel<typeof documentVersions>;
export type InsertDocumentVersion = InferInsertModel<typeof documentVersions>;

export const assets = sqliteTable('assets', {
	id: text('id').primaryKey().notNull(),
	key: text('key').unique().notNull(),
	mimeType: text('mime_type').notNull(),
	fileSize: integer('file_size').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixephic() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});
