import UserContext from '@/context/userContext';
import { useContext } from 'react';


// Custom hook to use the user context
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default useUserContext;
