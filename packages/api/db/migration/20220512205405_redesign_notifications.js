/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (saga.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

exports.up = async function (knex) {
  return knex.schema.alterTable('notification', (table) => {
    table.dropColumns('translation_key', 'entity_id', 'entity_type');
    table.jsonb('title');
    table.jsonb('body');
    table.jsonb('ref');
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable('notification', (table) => {
    table.dropColumns('title', 'body', 'ref');
    table.string('translation_key');
    table.string('entity_id');
    table.string('entity_type');
  });
};
