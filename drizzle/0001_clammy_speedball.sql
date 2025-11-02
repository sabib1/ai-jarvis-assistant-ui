CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`photo_url` text NOT NULL,
	`is_main` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
