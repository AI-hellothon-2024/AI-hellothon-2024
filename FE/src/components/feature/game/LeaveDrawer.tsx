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
          <DrawerClose className="absolute top-4 right-4">
            <X />
          </DrawerClose>
          <DrawerTitle className="text-center pt-16 text-xl">
            대화를 종료하시겠습니까?
          </DrawerTitle>
          <DrawerDescription className="text-center pt-5 pb-11">
            뒤로가기를 누르면
            <br />
            진행 중이던 대화가 모두 초기화됩니다.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2.5">
          <Button
            asChild
            className="rounded-full py-3 h-auto text-white font-semibold text-lg"
          >
            <Link href={"/"}>종료하기</Link>
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full rounded-full py-3 h-auto text-white font-semibold text-lg"
            >
              취소하기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LeaveDrawer;
