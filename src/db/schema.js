import {
    pgTable,
    pgEnum,
    serial,
    text,
    integer,
    timestamp,
    jsonb,
    check,
    index
} from 'drizzle-orm/pg-core';


export const matchStatusEnum = pgEnum('match_status', [
    'scheduled',
    'live',
    'finished',
]);


export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    sport: text('sport').notNull(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    status: matchStatusEnum('status').default('scheduled').notNull(),
    startTime: timestamp('start_time'),
    endTime: timestamp('end_time'),
    homeScore: integer('home_score').default(0).notNull(),
    awayScore: integer('away_score').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    homeScoreNonNegative: check('matches_home_score_non_negative', sql`${table.homeScore} >= 0`),
    awayScoreNonNegative: check('matches_away_score_non_negative', sql`${table.awayScore} >= 0`),
}));


export const commentary = pgTable('commentary', {
    id: serial('id').primaryKey(),
    matchId: integer('match_id')
        .notNull()
        .references(() => matches.id, { onDelete: 'cascade' }),
    minute: integer('minute'),
    sequence: integer('sequence'),
    period: text('period'),
    eventType: text('event_type'),
    actor: text('actor'),
    team: text('team'),
    message: text('message'),
    metadata: jsonb('metadata'),
    tags: text('tags').array(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    commentaryMatchIdIdx: index('commentary_match_id_idx').on(table.matchId),
}));