exports.up = function(knex) {
	return knex.schema
		.createTable("t_users", function (table) {
			table.increments();
			table.string("handle", 32).notNullable();
			table.string("email", 64).notNullable();
			table.string("name", 64).notNullable();
			table.timestamps();

			table.unique("email");
			table.unique("handle");
		})
		.createTable("t_pool", function(table) {
			table.increments();
			table.text("player");
			table.timestamps();
		})
		.createTable("t_leagues", function(table) {
			table.increments();
			table.string("name", 64).notNullable();
			table.timestamps();
		})
		.createTable("t_player_league_info", function(table) {
			table.integer("user_id").unsigned().notNullable();
			table.integer("league_id").unsigned().notNullable();
			table.boolean("admin").notNullable().defaultTo(false);
			table.integer("rank").unsigned();

			for (let i=0; i < 26; i++) {
				table.integer(`week${i}`).unsigned();
				table.foreign(`week${i}`).references("t_users.id");
			}

			table.timestamps();

			table.foreign("user_id").references("t_users.id");
			table.foreign("league_id").references("t_leagues.id");
			table.unique(["user_id", "league_id"]);
		})
		.createTable("t_rosters", function(table) {
			table.integer("user_id").unsigned().notNullable();
			table.integer("league_id").unsigned().notNullable();
			table.integer("player_id").unsigned().notNullable();
			table.timestamps();

			table.foreign("user_id").references("t_users.id");
			table.foreign("league_id").references("t_leagues.id");
			table.foreign("player_id").references("t_pool.id");
			table.unique(["user_id", "league_id"]);
		});
};

exports.down = function(knex) {
	/* Drop tables in reverse order of creation to prevent reference errors */
	return knex.schema
		.dropTable("t_rosters")
		.dropTable("t_player_league_info")
		.dropTable("t_leagues")
		.dropTable("t_pool")
		.dropTable("t_users")
		.raw("DROP TYPE permission_level");
};
