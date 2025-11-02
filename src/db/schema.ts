import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const aiResponses = sqliteTable('ai_responses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  responseText: text('response_text').notNull(),
  createdAt: text('created_at').notNull(),
});

export const photos = sqliteTable('photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  photoUrl: text('photo_url').notNull(),
  isMain: integer('is_main', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const themes = sqliteTable('themes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  cssCode: text('css_code').notNull(),
  isMain: integer('is_main', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const functions = sqliteTable('functions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const arceeResponses = sqliteTable('arcee_responses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  audioTranscript: text('audio_transcript').notNull(),
  audioUrl: text('audio_url').notNull(),
  createdAt: text('created_at').notNull(),
});