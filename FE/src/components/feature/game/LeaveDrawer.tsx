import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";

const LeaveDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <ChevronLeft className="ml-2" />
      </DrawerTrigger>
      <DrawerContent className="max-w-[600px] mx-auto bg-[#1E1E1E] border-[#1E1E1E]">
        <DrawerHeader>
          <DrawerClose className="absolute top-8 right-8">
            <X color="#DEDEDE" />
          </DrawerClose>
          <DrawerTitle className="text-center pt-16 text-xl">
            대화를 종료하시겠습니까?
          </DrawerTitle>
          <DrawerDescription className="text-center pt-5 pb-3 text-mute-20">
            뒤로가기를 누르면
            <br />
            진행 중이던 대화가 모두 초기화됩니다.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2.5">
          <DrawerClose asChild>
            <Button className="w-full rounded-full py-3 h-auto text-white font-semibold text-lg">
              대화 계속하기
            </Button>
          </DrawerClose>
          <Button
            asChild
            className="rounded-full py-3 h-auto font-semibold text-lg bg-[#424242] text-mute-20 hover:bg-[#494949]"
          >
            <Link href={"/"}>종료하기</Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LeaveDrawer;
