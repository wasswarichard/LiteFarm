export const up = function (knex) {
  return Promise.all([
    knex.schema.alterTable('userFarm', (t) => {
      t.jsonb('wage')
        .defaultTo(
          JSON.stringify({
            type: 'hourly',
            amount: 0,
            never_ask: false,
          }),
        )
        .alter();
    }),
  ]);
};

export const down = function (knex) {
  return Promise.all([
    knex.schema.alterTable('userFarm', (t) => {
      t.dropColumn('wage');
    }),
  ]);
};
