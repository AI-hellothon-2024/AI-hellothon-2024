import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return <div className="bg-white h-full">{children}</div>;
};

export default Layout;
