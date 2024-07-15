import React, { createContext } from "react";

const Context = createContext({});

const InternalProvider = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: any;
}) => {
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default InternalProvider;
export { Context };
