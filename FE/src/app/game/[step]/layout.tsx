import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  params: {
    step: `${number}`;
  };
}

const Layout = ({ children }: Props) => {
  return <>{children}</>;
};

export default Layout;
