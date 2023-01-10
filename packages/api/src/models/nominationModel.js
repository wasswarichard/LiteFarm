/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (farmModel.js) is part of LiteFarm.
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
import { Model } from 'objection';
import baseModel from './baseModel.js';
import nominationTypeModel from './nominationTypeModel.js';
import nominationStatusModel from './nominationStatusModel.js';
import farmModel from './farmModel.js';

// Describes the nomination table
// Base model extends objection.js
class Nomination extends baseModel {
  static get tableName() {
    return 'nomination';
  }

  static get idColumn() {
    return 'nomination_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['nomination_type', 'farm_id'],
      properties: {
        nomination_id: { type: 'integer' },
        nomination_type: { type: 'string' },
        farm_id: { type: 'uuid' },
        assignee_user_id: { type: 'string' },
        ...this.baseProperties,
      },
      additionalProperties: false,
    };
  }

  //How to choose a relation type: https://vincit.github.io/objection.js/guide/relations.html#examples
  static get relationMappings() {
    return {
      workflow: {
        relation: Model.BelongsToOneRelation,
        modelClass: nominationTypeModel,
        join: {
          from: 'nomination.nomination_type',
          to: 'nomination_type.name',
        },
      },
      status: {
        relation: Model.HasManyRelation,
        modelClass: nominationStatusModel,
        join: {
          from: 'nomination.nomination_id',
          to: 'nomination_status.nomination_id',
        },
      },
      farm: {
        relation: Model.BelongsToOneRelation,
        modelClass: farmModel,
        join: {
          from: 'nomination.farm_id',
          to: 'farm.farm_id',
        },
      },
    };
  }

  /**
   * Returns a true or false value about the whether a nomination has been soft deleted.
   * @param {number} nomination_id The primary key to the nomination table
   * @static
   * @async
   * @return {Promise<*>}
   */
  static async getDeletedByNominationId(nomination_id, trx) {
    return await Nomination.query(trx)
      .context({ showHidden: true })
      .select('deleted')
      .where('nomination_id', nomination_id)
      .first();
  }
}

export default Nomination;
