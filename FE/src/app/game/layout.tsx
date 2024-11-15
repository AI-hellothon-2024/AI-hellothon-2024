import { PropsWithChildren } from "react";
import LeaveDrawer from "@/components/feature/game/LeaveDrawer";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <header className="">
        <LeaveDrawer />
        상사가 고백할 때
      </header>
      {children}
    </>
  );
};

export default Layout;
