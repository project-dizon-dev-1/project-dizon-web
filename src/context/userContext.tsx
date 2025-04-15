import { Database } from "@/types/database";
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type User = Database["public"]["Tables"]["users-list"]["Row"] & {
  house_id: string | null | undefined;
  house_phase?: string | null;
};

//declare the type of your context
type UserContextType = {
  user: User | null | undefined;
  setUser: React.Dispatch<SetStateAction<User | null | undefined>>;
  //   logout: () => void;
};

// declare type for provider props
type UserProviderProps = {
  children: ReactNode;
};

// Create the context with default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the context provider and wrap the children
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
