import React, { createContext, useContext, useState } from 'react';

const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [isReminderVisible, setIsReminderVisible] = useState(false);

  const showReminder = () => {
    setIsReminderVisible(true);
  };

  const hideReminder = () => {
    setIsReminderVisible(false);
  };

  return (
    <ReminderContext.Provider value={{ isReminderVisible, showReminder, hideReminder }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminder = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminder must be used within a ReminderProvider');
  }
  return context;
};
