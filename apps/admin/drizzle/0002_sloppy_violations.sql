CREATE TABLE `document_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`key` text,
	`created_at` integer DEFAULT (unixephic() * 1000) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `document_versions_key_unique` ON `document_versions` (`key`);--> statement-breakpoint
ALTER TABLE `documents` ADD `publish_date` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `documents_slug_unique` ON `documents` (`slug`);