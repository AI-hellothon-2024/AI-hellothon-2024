import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  params: {
    status: "ongoing" | "finished";
  };
}

const Layout = ({ children }: Props) => {
  return <div className="h-dvh">{children}</div>;
};

export default Layout;
