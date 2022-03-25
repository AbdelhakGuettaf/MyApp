import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Dispatcher } from "./Dispatcher";

interface DispatchersProps {}

export const Dispatchers: React.FC<DispatchersProps> = ({}) => {
  const dispatchers = useAppSelector((state) => state.Dispatchers);
  return (
    <>
      {dispatchers.map((user, key) => (
        <Dispatcher user={user} key={key} />
      ))}
    </>
  );
};
