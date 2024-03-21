import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getDateInputFormat } from '../../../util/moment';
import DateRangePicker from '../../Form/DateRangePicker';
import Switch from '../../Form/Switch';
import styles from './styles.module.scss';

export function FilterDateRange({
  setDirty,
  defaultFromDate,
  defaultToDate,
  onDirty,
  subject,
  shouldReset,
  style,
  className,
  onChange,
}) {
  const [fromDate, setFromDate] = useState(defaultFromDate ?? '');
  const [toDate, setToDate] = useState(defaultToDate ?? '');

  useEffect(() => {
    if (shouldReset) {
      setFromDate('');
      setToDate('');
    }
  }, [shouldReset]);

  const [showDateFilter, setShowDateFilter] = useState(!!(defaultFromDate || defaultToDate));
  const onSwitchClick = () => {
    setDirty?.();
    if (showDateFilter) {
      onDirty?.();
      setShowDateFilter(false);
      setFromDate('');
      setToDate('');
    } else {
      setShowDateFilter(true);
      setFromDate(() => {
        if (defaultFromDate) return defaultFromDate;
        if (!defaultToDate) return getDateInputFormat();
      });
      setToDate(() => {
        if (defaultToDate) return defaultToDate;
        if (!defaultFromDate) {
          const toDate = new Date();
          toDate.setDate(toDate.getDate() + 7);
          return getDateInputFormat(toDate);
        }
      });
    }
  };
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    onChange(e.target.value || undefined);
    setDirty?.();
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    onChange(e.target.value || undefined);
    setDirty?.();
  };
  return (
    <div className={clsx([styles.container, className])} style={style}>
      <Switch label={subject} checked={showDateFilter} onChange={onSwitchClick} />
      {showDateFilter && (
        <>
          <DateRangePicker
            fromProps={{
              value: fromDate,
              onChange: handleFromDateChange,
            }}
            toProps={{
              value: toDate,
              onChange: handleToDateChange,
            }}
          />
        </>
      )}
    </div>
  );
}

FilterDateRange.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  removable: PropTypes.bool,
  shouldReset: PropTypes.number,
  className: PropTypes.string,
  setDirty: PropTypes.func,
  defaultFromDate: PropTypes.string,
  defaultToDate: PropTypes.string,
  onDirty: PropTypes.func,
  subject: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
};
