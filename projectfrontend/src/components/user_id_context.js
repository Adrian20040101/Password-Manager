import React, { createContext, useState } from 'react';

const UserIdContext = createContext();

const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};

const useUserId = () => {
  const context = React.useContext(UserIdContext);
  if (context === undefined) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
};

export { UserIdProvider, useUserId };
