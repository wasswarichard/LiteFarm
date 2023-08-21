/*
 *  Copyright 2023 LiteFarm.org
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

import React from 'react';
import PureSimpleCustomType from '../../../components/Forms/SimpleCustomType';
import decorators from '../config/Decorators';

export default {
  title: 'Form/SimpleCustomType',
  decorators: decorators,
  component: PureSimpleCustomType,
};

const Template = (args) => <PureSimpleCustomType {...args} />;

const args = {
  handleGoBack: () => {
    console.log('Go back');
  },
  inputLabel: 'Custom Type Name',
  customTypeRegister: 'custom_type_name',
};

export const AddCustomType = Template.bind({});
AddCustomType.args = {
  view: 'add',
  buttonText: 'Save',
  pageTitle: 'Add a custom type',
  onSubmit: () => {
    console.log('Added a new custom type');
  },
  ...args,
};

export const ReadOnlyCustomType = Template.bind({});
ReadOnlyCustomType.args = {
  view: 'read-only',
  buttonText: 'Edit',
  pageTitle: 'Custom Type',
  defaultValue: 'This is my test name',
  onClick: () => {
    console.log('Moving to edit mode');
  },
  ...args,
};

export const EditCustomType = Template.bind({});
EditCustomType.args = {
  view: 'edit',
  buttonText: 'Update',
  pageTitle: 'Edit custom type',
  defaultValue: 'This is my test name',
  onSubmit: () => {
    console.log('Updated a custom type');
  },
  ...args,
};
