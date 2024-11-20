import { MotionSVG } from "@/components/motion";
import type { SVGMotionProps } from "framer-motion";

const Icon = ({ className, ...props }: SVGMotionProps<SVGElement>) => {
  return (
    <MotionSVG
      className={className}
      {...props}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.91814 17.4971C7.23643 17.4971 5.73309 17.1436 4.38263 16.4368C3.03217 15.7299 1.962 14.72 1.17211 13.3819C0.382213 12.0439 0 10.5291 0 8.78712C0 7.04513 0.382213 5.53035 1.17211 4.1923C1.962 2.85424 3.00669 1.84439 4.35715 1.13749C5.70761 0.430597 7.21095 0.0771484 8.89266 0.0771484C10.5744 0.0771484 12.0777 0.430597 13.4282 1.13749C14.7786 1.84439 15.8233 2.85424 16.6132 4.1923C17.3776 5.5051 17.7853 7.04513 17.7853 8.78712C17.7853 10.5291 17.4031 12.0691 16.6387 13.3819C15.8743 14.6948 14.8296 15.7046 13.4791 16.4115C12.1541 17.1184 10.6508 17.4718 8.9691 17.4718L8.91814 17.4971ZM8.91814 13.0033C9.91187 13.0033 10.7527 12.6498 11.4152 11.9177C12.0777 11.1855 12.409 10.1504 12.409 8.78712C12.409 7.42382 12.0777 6.36348 11.3897 5.65658C10.7272 4.94968 9.86091 4.57099 8.8417 4.57099C7.82248 4.57099 7.00711 4.92444 6.31914 5.65658C5.63117 6.38872 5.29993 7.42382 5.29993 8.78712C5.29993 10.1504 5.65665 11.1855 6.34462 11.9177C7.05807 12.6498 7.89892 13.0033 8.89266 13.0033H8.91814Z"
        fill="#FF8C42"
      />
      <path
        d="M17.7343 2.92936C17.7343 2.55066 17.6833 1.46507 17.6833 1.46507C17.6833 0.85916 17.2501 0.303741 16.6896 0.101771C16.2819 -0.0497073 15.9506 -0.024461 15.6194 0.127017C14.6002 0.606697 13.8357 1.86901 13.3771 2.80313C13.3771 2.85362 13.3771 2.87886 13.3262 2.92936C13.0459 3.51002 12.842 4.09069 12.7146 4.72184C12.6127 5.22677 12.5363 5.75694 12.5363 6.28711V9.99832H16.5876L17.7597 9.19044V2.9546L17.7343 2.92936Z"
        fill="#FF8C42"
      />
    </MotionSVG>
  );
};
const Loading = () => {
  return (
    <div className="flex gap-2 justify-center min-g-6 items-center">
      <Icon
        animate={{
          y: [0, -4, 0],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <Icon
        animate={{
          y: [0, -4, 0],
        }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
      />
      <Icon
        animate={{
          y: [0, -4, 0],
        }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
    </div>
  );
};

export default Loading;
