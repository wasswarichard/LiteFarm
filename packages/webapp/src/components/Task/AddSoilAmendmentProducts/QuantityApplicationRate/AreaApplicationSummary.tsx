/*
 *  Copyright 2024 LiteFarm.org
 *  This file is part of LiteFarm.
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

import { Trans } from 'react-i18next';
import { Main } from '../../../Typography';

interface AreaApplicationSummaryProps {
  locationArea: number;
  locationAreaUnit: string;
  percentOfArea: number;
  locationType: string;
}

export const AreaApplicationSummary = ({
  locationArea,
  locationAreaUnit,
  percentOfArea,
  locationType,
}: AreaApplicationSummaryProps) => {
  return (
    <Main>
      <Trans
        i18nKey="ADD_TASK.SOIL_AMENDMENT_VIEW.APPLIED_TO"
        values={{
          percentOfArea,
          locationArea,
          locationAreaUnit,
          locationType,
        }}
      >
        Applied to <b>{{ percentOfArea } as any}%</b> of your{' '}
        <em>
          {/* see https://github.com/i18next/react-i18next/issues/1483 */}
          {{ locationArea } as any} {{ locationAreaUnit } as any}
        </em>{' '}
        {locationType}
      </Trans>
    </Main>
  );
};
