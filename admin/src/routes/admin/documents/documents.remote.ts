import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

import { getDBFromEnv } from '$lib/server/db/db';
import { documents, documentVersions, users } from '$lib/server/db/schema';

import { getRequestEvent, query } from '$app/server';

export const getDocuments = query(async ({ limit = 25, offset = 0 } = {}) => {
	const { locals } = getRequestEvent();
	if (!locals.session) {
		redirect(301, '/login');
	}

	const db = getDBFromEnv();
	const results = await db
		.select({
			id: documents.id,
			revisionId: documentVersions.id,
			title: documentVersions.title,
			description: documentVersions.description,
			slug: documents.slug,
			author: users.email
		})
		.from(documents)
		.leftJoin(documentVersions, eq(documentVersions.documentId, documents.id))
		.leftJoin(users, eq(documents.userId, users.id))
		.limit(limit)
		.offset(offset)
		.orderBy(desc(documents.createdAt));

	return results;
});
