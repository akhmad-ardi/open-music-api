/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: { type: 'varchar(50)', primaryKey: true },
    playlist_id: {
      type: 'varchar(50)',
      references: 'playlists',
      onDelete: 'CASCADE',
    },
    song_id: {
      type: 'varchar(50)',
      references: 'songs',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'varchar(50)',
      references: 'users',
      onDelete: 'CASCADE',
    },
    action: { type: 'varchar(20)', notNull: true },
    time: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};

module.exports = { up, down };
