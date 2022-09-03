import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComponent from '../ModalComponent/v2';
import styles from './styles.module.scss';
import Button from '../../Form/Button';
import ReactSelect from '../../Form/ReactSelect';
import Checkbox from '../../Form/Checkbox';
import { ReactComponent as Person } from '../../../assets/images/task/Person.svg';
import { tasksSelector } from '../../../containers/taskSlice';
import { useSelector } from 'react-redux';
import Input, { numberOnKeyDown } from '../../Form/Input';
import { useForm } from 'react-hook-form';

export default function TaskQuickAssignModal({
  dismissModal,
  task_id,
  due_date,
  isAssigned,
  onAssignTasksOnDate,
  onAssignTask,
  users,
  user,
}) {
  const { t } = useTranslation();

  const selfOption = {
    label: `${user.first_name} ${user.last_name}`,
    value: user.user_id,
    ...user,
  };

  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  const unAssignedOption = { label: t('TASK.UNASSIGNED'), value: null, isDisabled: false };
  const options = useMemo(() => {
    if (user.is_admin) {
      const options = users
        .map(({ first_name, last_name, user_id, ...rest }) => ({
          label: `${first_name} ${last_name}`,
          value: user_id,
          ...rest,
        }))
        .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
      unAssignedOption.isDisabled = !isAssigned;
      options.unshift(unAssignedOption);
      return options;
    } else return [selfOption, unAssignedOption];
  }, []);

  const [selectedWorker, setWorker] = useState(isAssigned ? unAssignedOption : selfOption);
  const [assignAll, setAssignAll] = useState(false);
  const [askAlways, setAskAlways] = useState(false);
  const [wageAmount, setWageAmount] = useState(0);

  const tasks = useSelector(tasksSelector);

  const checkUnassignedTaskForSameDate = () => {
    console.log(tasks);
    const selectedTask = tasks.find((t) => t.task_id == task_id);
    let isUnassignedTaskPresent = false;
    for (let task of tasks) {
      if (
        task.due_date === selectedTask.due_date &&
        !task.assignee &&
        task.task_id !== task_id &&
        task.complete_date === null
      ) {
        isUnassignedTaskPresent = true;
        break;
      }
    }
    return isUnassignedTaskPresent;
  };

  const onAssign = () => {
    assignAll && checkUnassignedTaskForSameDate() && selectedWorker.value !== null
      ? onAssignTasksOnDate({
          task_id: task_id,
          date: due_date,
          assignee_user_id: selectedWorker.value,
          wage: {
            ask_always: askAlways,
            amount: parseInt(wageAmount),
            type: 'hourly',
          },
          email: selectedWorker.email,
        })
      : onAssignTask({
          task_id: task_id,
          assignee_user_id: selectedWorker.value,
        });
    dismissModal();
  };

  const onCheckedAll = () => {
    setAssignAll(!assignAll);
  };

  const onCheckAskAlways = () => {
    setAskAlways(!askAlways);
  };

  const disabled = selectedWorker === null;

  return (
    <ModalComponent
      dismissModal={dismissModal}
      title={t('ADD_TASK.ASSIGN_TASK')}
      buttonGroup={
        <>
          <Button onClick={dismissModal} className={styles.button} color="secondary" sm>
            {t('common:CANCEL')}
          </Button>

          <Button
            data-cy="quickAssign-update"
            onClick={onAssign}
            disabled={disabled}
            className={styles.button}
            color="primary"
            sm
          >
            {t('common:UPDATE')}
          </Button>
        </>
      }
      icon={<Person />}
    >
      <ReactSelect
        data-cy="quickAssign-assignee"
        defaultValue={selectedWorker}
        label={t('ADD_TASK.ASSIGNEE')}
        options={options}
        onChange={setWorker}
        style={{ marginBottom: '24px' }}
        isSearchable
      />
      {/*TODO: properly fix checkbox label overflow ST-272*/}

      {selectedWorker.wage?.amount > 0 ||
      selectedWorker.wage?.ask_always === false ||
      user.role_id === 3 ||
      selectedWorker.value === null ? (
        <Checkbox
          data-cy="quickAssign-assignAll"
          style={{ paddingRight: '24px' }}
          label={t('ADD_TASK.ASSIGN_ALL_TO_PERSON')}
          onChange={onCheckedAll}
        />
      ) : (
        <>
          <div style={{ marginBottom: '24px', color: '#AA5F03' }}>
            {selectedWorker.label} doesn&rsquo;t currently have an hourly wage assigned, Would you
            like to set one now?
          </div>
          <Input
            label={t('INVITE_USER.WAGE')}
            step="0.01"
            type="number"
            onKeyPress={numberOnKeyDown}
            value={wageAmount}
            onChange={(e) => {
              setWageAmount(e.target.value);
            }}
            hookFormRegister={register('wage', {
              min: { value: 0, message: t('INVITE_USER.WAGE_RANGE_ERROR') },
              valueAsNumber: true,
              max: { value: 999999999, message: t('INVITE_USER.WAGE_RANGE_ERROR') },
            })}
            style={{ marginBottom: '24px' }}
            errors={errors['wage'] && (errors['wage'].message || t('INVITE_USER.WAGE_ERROR'))}
            optional
          />
          <Checkbox
            data-cy="quickAssign-neverAsk"
            style={{ paddingRight: '24px', marginBottom: '24px' }}
            label={t('ADD_TASK.DO_NOT_ASK_AGAIN')}
            onChange={onCheckAskAlways}
          />
          <Checkbox
            data-cy="quickAssign-allTaskChanges"
            style={{ paddingRight: '24px' }}
            label={t('ADD_TASK.MAKE_ALL_TASK_CHANGES')}
            onChange={onCheckedAll}
          />
        </>
      )}
    </ModalComponent>
  );
}
