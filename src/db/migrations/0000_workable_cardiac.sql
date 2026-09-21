CREATE TABLE `plants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`species` text,
	`common_name` text,
	`photo_uri` text,
	`created_at` integer NOT NULL,
	`watering_interval_days` integer,
	`light_requirement` text,
	`humidity_requirement` text,
	`notes` text
);
