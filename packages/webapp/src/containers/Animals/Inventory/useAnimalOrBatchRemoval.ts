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

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  useDeleteAnimalBatchesMutation,
  useDeleteAnimalsMutation,
  useRemoveAnimalBatchesMutation,
  useRemoveAnimalsMutation,
} from '../../../store/api/apiSlice';
import { toLocalISOString } from '../../../util/moment';
import { parseInventoryId } from '../../../util/animal';
import { CREATED_IN_ERROR_ID, FormFields } from '../../../components/Animals/RemoveAnimalsModal';
import useMutations from '../../../hooks/api/useMutations';
import { enqueueErrorSnackbar, enqueueSuccessSnackbar } from '../../Snackbar/snackbarSlice';
import { TFunction } from 'i18next';

const useAnimalOrBatchRemoval = (
  selectedInventoryIds: string[],
  setSelectedInventoryIds: Dispatch<SetStateAction<string[]>>,
  dispatch: Dispatch<any>,
  t: TFunction,
) => {
  const [removeAnimals] = useRemoveAnimalsMutation();
  const [removeBatches] = useRemoveAnimalBatchesMutation();

  const { mutations, isLoading, isError, isSuccess } = useMutations([
    { label: 'deleteAnimals', hook: useDeleteAnimalsMutation },
    { label: 'deleteBatches', hook: useDeleteAnimalBatchesMutation },
  ]);

  const [removalModalOpen, setRemovalModalOpen] = useState(false);

  const removeFromSelectedIds = (removeTheseIds: string[]) => {
    const newArray = selectedInventoryIds;
    removeTheseIds.forEach((removalId: string): void => {
      const index = newArray.indexOf(removalId);
      if (index > -1) {
        // only splice array when item is found
        newArray.splice(index, 1); // 2nd parameter means remove one item only
      }
    });
    return newArray;
  };

  const handleAnimalOrBatchRemoval = (formData: FormFields) => {
    const timestampedDate = toLocalISOString(formData.date);

    const animalRemovalArray = [];
    const animalBatchRemovalArray = [];

    for (const id of selectedInventoryIds) {
      const { kind, id: entity_id } = parseInventoryId(id);
      if (kind === 'ANIMAL') {
        animalRemovalArray.push({
          id: entity_id,
          animal_removal_reason_id: Number(formData.reason), // mobile UI uses a native radio input & will always generate a string
          removal_explanation: formData.explanation,
          removal_date: timestampedDate,
        });
      } else if (kind === 'BATCH') {
        animalBatchRemovalArray.push({
          id: entity_id,
          animal_removal_reason_id: Number(formData.reason),
          removal_explanation: formData.explanation,
          removal_date: timestampedDate,
        });
      }
    }

    animalRemovalArray.length && removeAnimals(animalRemovalArray);
    animalBatchRemovalArray.length && removeBatches(animalBatchRemovalArray);

    setRemovalModalOpen(false);
    setSelectedInventoryIds([]);
  };

  const handleAnimalOrBatchDeletion = async () => {
    const animalIds = [];
    const selectedAnimalIds = [];
    const animalBatchIds = [];
    const selectedBatchIds = [];

    for (const id of selectedInventoryIds) {
      const { kind, id: entity_id } = parseInventoryId(id);
      if (kind === 'ANIMAL') {
        animalIds.push(entity_id);
        selectedAnimalIds.push(id);
      } else if (kind === 'BATCH') {
        animalBatchIds.push(entity_id);
        selectedBatchIds.push(id);
      }
    }

    try {
      if (animalIds.length) {
        await mutations['deleteAnimals'].trigger(animalIds).unwrap();
        const newIdState = removeFromSelectedIds(selectedAnimalIds);
        setSelectedInventoryIds(newIdState);
        dispatch(enqueueSuccessSnackbar(t('ANIMALS.SUCCESS_REMOVE_ANIMALS', { ns: 'message' })));
      }
    } catch (err) {
      dispatch(enqueueErrorSnackbar(t('ANIMALS.FAILED_REMOVE_ANIMALS', { ns: 'message' })));
    }

    try {
      if (animalBatchIds.length) {
        await mutations['deleteBatches'].trigger(animalBatchIds).unwrap();
        const newIdState = removeFromSelectedIds(selectedBatchIds);
        setSelectedInventoryIds(newIdState);
        dispatch(enqueueSuccessSnackbar(t('ANIMALS.SUCCESS_REMOVE_BATCHES', { ns: 'message' })));
      }
    } catch (err) {
      dispatch(enqueueErrorSnackbar(t('ANIMALS.FAILED_REMOVE_BATCHES', { ns: 'message' })));
    }

    setRemovalModalOpen(false);
  };

  const onConfirmRemoveAnimals = (formData: FormFields) => {
    if (Number(formData.reason) === CREATED_IN_ERROR_ID) {
      handleAnimalOrBatchDeletion();
    } else {
      handleAnimalOrBatchRemoval(formData);
    }
  };

  return { onConfirmRemoveAnimals, removalModalOpen, setRemovalModalOpen };
};

export default useAnimalOrBatchRemoval;
