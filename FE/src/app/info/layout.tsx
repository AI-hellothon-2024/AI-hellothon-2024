import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-16 pt-11 pb-4 h-dvh">{children}</div>
  );
};

export default Layout;
