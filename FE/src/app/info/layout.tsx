import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-16 pt-11 h-full pb-4">{children}</div>
  );
};

export default Layout;
