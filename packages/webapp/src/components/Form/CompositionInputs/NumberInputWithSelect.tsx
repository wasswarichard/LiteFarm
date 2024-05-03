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
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Controller, useController } from 'react-hook-form';
import ReactSelect from '../ReactSelect';
import useReactSelectStyles from '../Unit/useReactSelectStyles';
import useNumberInput from '../NumberInput/useNumberInput';
import InputBase from '../InputBase';
import { Cross } from '../../Icons';
import { styles as reactSelectDefaultStyles } from '../ReactSelect';
import styles from './styles.module.scss';

type NumberInputWithSelectProps = {
  control: any;
  getValues: any;
  name: string;
  unitName: string;
  label: string;
  unitOptions: { label: any; value: string }[];
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
};

const REACT_SELECT_WIDTH = 44;

const NumberInputWithSelect = ({
  control,
  getValues,
  name,
  unitName,
  label,
  unitOptions,
  disabled,
  hasError,
  className,
}: NumberInputWithSelectProps) => {
  const { t } = useTranslation();
  const reactSelectStyles = useReactSelectStyles(disabled, {
    reactSelectWidth: REACT_SELECT_WIDTH,
  });
  reactSelectStyles.control = (provided) => ({
    ...provided,
    boxShadow: 'none',
    borderRadius: 0,
    height: '46px',
    paddingLeft: disabled ? '4px' : '8px',
    fontSize: '16px',
    border: 'none',
    background: 'inherit',
  });
  reactSelectStyles.singleValue = (provided) => ({
    ...provided,
    color: 'var(--Colors-Neutral-Neutral-300, #98A1B1);',
  });
  reactSelectStyles.option = (provided, state) => ({
    ...reactSelectDefaultStyles.option?.(provided, state),
    color: 'var(--Colors-Neutral-Neutral-300, #98A1B1);',
  });

  const { field } = useController({ control, name });
  const { inputProps, reset } = useNumberInput({
    onChange: (value) => field.onChange(value),
    initialValue: getValues(name),
    max: 999999999,
  });

  return (
    <div
      className={clsx(
        styles.inputWithSelectWrapper,
        hasError && styles.hasError,
        disabled && styles.disabled,
        className,
      )}
    >
      <InputBase
        {...inputProps}
        label={label}
        optional
        placeholder={disabled ? '' : t('common:ENTER_VALUE')}
        disabled={disabled}
        error={hasError ? 'Error text that will not be shown' : ''}
        showErrorText={false}
        showResetIcon={false}
        rightSection={
          <>
            {/* TODO */}
            {hasError && <Cross isClickable onClick={reset} />}
            <div className={styles.selectWrapper} onClick={(e) => e.preventDefault()}>
              <Controller
                control={control}
                name={unitName}
                render={({ field: { onChange, value } }) => (
                  <ReactSelect
                    options={unitOptions}
                    onChange={onChange}
                    value={value}
                    styles={{ ...(reactSelectStyles as any) }}
                    isDisabled={disabled}
                  />
                )}
              />
            </div>
          </>
        }
      />
    </div>
  );
};

export default NumberInputWithSelect;
