CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`phone` text NOT NULL,
	`wechat` text NOT NULL,
	`scenario` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'xiangge-ai-workflow-site' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
