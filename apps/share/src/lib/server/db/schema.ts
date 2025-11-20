import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, integer, index, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

const CONTROL_POLICIES = ['public', 'only-link', 'only-allow', 'disallow'] as const;

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey().notNull(),
		email: text('email').notNull().unique(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		avatarId: text('avatar_id').references(() => artifacts.id, { onDelete: 'set null' }),
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

export const userGroups = sqliteTable('user_groups', {
	name: text('name').primaryKey().unique().notNull(),
	displayName: text('display_name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export type UserGroup = InferSelectModel<typeof userGroups>;
export type InsertUserGroup = InferInsertModel<typeof userGroups>;

export const userUserGroups = sqliteTable(
	'user_user_groups',
	{
		userId: text('user_id').notNull(),
		userGroupName: text('user_group_name').notNull()
	},
	(t) => [index('user_id_user_group_name_idx').on(t.userId, t.userGroupName)]
);

export type UserUserGroup = InferSelectModel<typeof userUserGroups>;
export type InsertUserUserGroup = InferInsertModel<typeof userUserGroups>;

export const artifacts = sqliteTable('artifacts', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	key: text('key').unique().notNull(),
	fileSize: integer('file_size').notNull(),
	mimetype: text('mimetype').notNull(),
	artifactGroupId: text('artifact_group_id').references(() => artifactGroups.id, {
		onDelete: 'cascade'
	}),
	description: text('description'),
	controlPolicy: text('control_policy', { enum: CONTROL_POLICIES }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export type Artifact = InferSelectModel<typeof artifacts>;
export type InsertArtifact = InferInsertModel<typeof artifacts>;

export const artifactAllowUsers = sqliteTable(
	'artifact_allow_users',
	{
		artifactId: text('artifact_id')
			.notNull()
			.references(() => artifacts.id),
		userId: text('user_id')
			.notNull()
			.references(() => users.id)
	},
	(t) => [index('artifact_id_user_id_idx').on(t.artifactId, t.userId)]
);

export const artifactAllowUserGroups = sqliteTable(
	'artifact_allow_user_groups',
	{
		artifactId: text('artifact_id')
			.notNull()
			.references(() => artifacts.id),
		userGroupName: text('user_group_name')
			.notNull()
			.references(() => userGroups.name)
	},
	(t) => [index('artifact_id_user_group_name_idx').on(t.artifactId, t.userGroupName)]
);
export const artifactGroups = sqliteTable('artifact_groups', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	slug: text('slug').unique().notNull(),
	description: text('description'),
	controlPolicy: text('control_policy', { enum: CONTROL_POLICIES }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
});

export const artifactGroupAllowUsers = sqliteTable(
	'artifact_allow_users',
	{
		artifactGroupId: text('artifact_group_id')
			.notNull()
			.references(() => artifactGroups.id),
		userId: text('user_id')
			.notNull()
			.references(() => users.id)
	},
	(t) => [index('artifact_group_id_user_id_idx').on(t.artifactGroupId, t.userId)]
);

export const artifactGroupAllowUserGroups = sqliteTable(
	'artifact_allow_user_groups',
	{
		artifactGroupId: text('artifact_group_id')
			.notNull()
			.references(() => artifactGroups.id),
		userGroupName: text('user_group_name')
			.notNull()
			.references(() => userGroups.name)
	},
	(t) => [index('artifact_group_id_user_group_name_idx').on(t.artifactGroupId, t.userGroupName)]
);
