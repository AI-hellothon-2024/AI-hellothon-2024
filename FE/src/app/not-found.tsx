import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex-center">404😵</div>
      <Link href="/" className="mx-10 bg-gray-200 py-6 text-center">
        메인으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
