CREATE TABLE `artifact_allow_user_groups` (
	`artifact_group_id` text NOT NULL,
	`user_group_name` text NOT NULL,
	FOREIGN KEY (`artifact_group_id`) REFERENCES `artifact_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_group_name`) REFERENCES `user_groups`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `artifact_group_id_user_group_name_idx` ON `artifact_allow_user_groups` (`artifact_group_id`,`user_group_name`);--> statement-breakpoint
CREATE TABLE `artifact_allow_users` (
	`artifact_group_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`artifact_group_id`) REFERENCES `artifact_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `artifact_group_id_user_id_idx` ON `artifact_allow_users` (`artifact_group_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `artifact_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`control_policy` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artifact_groups_slug_unique` ON `artifact_groups` (`slug`);--> statement-breakpoint
CREATE TABLE `artifacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`file_size` integer NOT NULL,
	`mimetype` text NOT NULL,
	`artifact_group_id` text,
	`description` text,
	`control_policy` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`artifact_group_id`) REFERENCES `artifact_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `artifacts_key_unique` ON `artifacts` (`key`);--> statement-breakpoint
CREATE TABLE `user_groups` (
	`name` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_groups_name_unique` ON `user_groups` (`name`);--> statement-breakpoint
CREATE TABLE `user_user_groups` (
	`user_id` text NOT NULL,
	`user_group_name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `user_id_user_group_name_idx` ON `user_user_groups` (`user_id`,`user_group_name`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`avatar_id` text,
	`display_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`avatar_id`) REFERENCES `artifacts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);