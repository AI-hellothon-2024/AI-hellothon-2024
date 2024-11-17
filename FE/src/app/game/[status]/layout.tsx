import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  params: {
    status: "ongoing" | "finished";
  };
}

const Layout = ({ children }: Props) => {
  return <>{children}</>;
};

export default Layout;
