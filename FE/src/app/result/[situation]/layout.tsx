import { PropsWithChildren } from "react";
import { SITUATIONS } from "@/lib/constants";

interface Props extends PropsWithChildren {
  params: {
    situation: keyof typeof SITUATIONS;
  };
}

const Layout = ({ children, params }: Props) => {
  return (
    <>
      <header>{SITUATIONS[params.situation]}</header>
      {children}
    </>
  );
};

export default Layout;
