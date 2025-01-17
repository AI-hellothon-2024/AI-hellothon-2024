import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const SendButton = ({ className, ...props }: ComponentProps<"button">) => {
  return (
    <button
      className={twMerge("px-4 flex items-end py-3", className)}
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.235 5.68609C20.667 4.49109 19.509 3.33309 18.314 3.76609L3.70904 9.04809C2.51004 9.48209 2.36504 11.1181 3.46804 11.7571L8.13004 14.4561L12.293 10.2931C12.4816 10.1109 12.7342 10.0101 12.9964 10.0124C13.2586 10.0147 13.5095 10.1199 13.6949 10.3053C13.8803 10.4907 13.9854 10.7415 13.9877 11.0037C13.99 11.2659 13.8892 11.5185 13.707 11.7071L9.54404 15.8701L12.244 20.5321C12.882 21.6351 14.518 21.4891 14.952 20.2911L20.235 5.68609Z"
          fill="#FF8C42"
        />
      </svg>
    </button>
  );
};

export default SendButton;
