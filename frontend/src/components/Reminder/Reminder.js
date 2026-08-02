import React from 'react';
import { notification } from 'antd';

const Reminder = ({ isVisible }) => {
  if (isVisible) {
    notification.warning({
      message: 'Pending Tasks Reminder',
      description: 'You have pending tasks. Please complete them.',
    });
  }

  return null;
};

export default Reminder;
