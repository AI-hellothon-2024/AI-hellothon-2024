import { MotionDiv, MotionPath } from "@/components/motion";
import type { HTMLMotionProps, Variants } from "framer-motion";

const Icon = ({
  className,
  fill = false,
  delay = 0,
  width = 24,
  height = 21,
}: {
  className?: string;
  fill?: boolean;
  delay?: number;
  width?: number;
  height?: number;
}) => {
  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_496_2854)">
          <path
            d="M23.9986 8.39648H22.5897V9.79639H23.9986V8.39648Z"
            fill="white"
          />
          <path
            d="M22.5897 9.79639H21.175V11.1963H22.5897V9.79639Z"
            fill="white"
          />
          <path
            d="M22.5897 7.00244H21.175V8.3967H22.5897V7.00244Z"
            fill="white"
          />
          <path
            d="M21.1751 18.1987H19.7661V19.5986H21.1751V18.1987Z"
            fill="white"
          />
          <path
            d="M21.1751 11.1978H19.7661V12.5977H21.1751V11.1978Z"
            fill="white"
          />
          <path
            d="M21.1751 7.00244H19.7661V8.3967H21.1751V7.00244Z"
            fill="white"
          />
          <path d="M19.7647 19.6001H18.3501V21H19.7647V19.6001Z" fill="white" />
          <path
            d="M19.7647 16.7988H18.3501V18.1987H19.7647V16.7988Z"
            fill="white"
          />
          <path
            d="M19.7647 15.3989H18.3501V16.7988H19.7647V15.3989Z"
            fill="white"
          />
          <path
            d="M19.7647 11.1978H18.3501V12.5977H19.7647V11.1978Z"
            fill="white"
          />
          <path
            d="M19.7647 7.00244H18.3501V8.3967H19.7647V7.00244Z"
            fill="white"
          />
          <path d="M18.3501 19.6001H16.9412V21H18.3501V19.6001Z" fill="white" />
          <path
            d="M18.3501 13.9976H16.9412V15.3975H18.3501V13.9976Z"
            fill="white"
          />
          <path
            d="M18.3501 12.5977H16.9412V13.9976H18.3501V12.5977Z"
            fill="white"
          />
          <path
            d="M18.3501 7.00244H16.9412V8.3967H18.3501V7.00244Z"
            fill="white"
          />
          <path
            d="M16.9412 18.1987H15.5266V19.5986H16.9412V18.1987Z"
            fill="white"
          />
          <path
            d="M16.9412 7.00244H15.5266V8.3967H16.9412V7.00244Z"
            fill="white"
          />
          <path
            d="M15.5251 18.1987H14.1162V19.5986H15.5251V18.1987Z"
            fill="white"
          />
          <path
            d="M15.5251 5.60107H14.1162V7.00098H15.5251V5.60107Z"
            fill="white"
          />
          <path
            d="M15.5251 4.20117H14.1162V5.60108H15.5251V4.20117Z"
            fill="white"
          />
          <path
            d="M14.1162 16.7988H12.7073V18.1987H14.1162V16.7988Z"
            fill="white"
          />
          <path
            d="M14.1162 2.80127H12.7073V4.20118H14.1162V2.80127Z"
            fill="white"
          />
          <path
            d="M14.1162 1.3999H12.7073V2.79981H14.1162V1.3999Z"
            fill="white"
          />
          <path
            d="M12.7073 15.3989H11.2927V16.7988H12.7073V15.3989Z"
            fill="white"
          />
          <path
            d="M15.5266 9.79639H14.1162V11.1977H15.5266H16.9412V9.79639H15.5266Z"
            fill="white"
          />
          <path
            d="M14.1162 8.39648H12.7073V9.79639H14.1162V8.39648Z"
            fill="white"
          />
          <path
            d="M12.7073 5.60107H11.2927V7.00239V8.39665H12.7073V7.00239V5.60107Z"
            fill="white"
          />
          <path d="M12.7073 0H11.2927V1.39991H12.7073V0Z" fill="white" />
          <path
            d="M11.2913 16.7988H9.88235V18.1987H11.2913V16.7988Z"
            fill="white"
          />
          <path
            d="M11.2913 2.80127H9.88235V4.20118H11.2913V2.80127Z"
            fill="white"
          />
          <path
            d="M11.2913 1.3999H9.88235V2.79981H11.2913V1.3999Z"
            fill="white"
          />
          <path
            d="M9.88235 18.1987H8.46774V19.5986H9.88235V18.1987Z"
            fill="white"
          />
          <path
            d="M9.88235 5.60107H8.46774V7.00098H9.88235V5.60107Z"
            fill="white"
          />
          <path
            d="M9.88235 4.20117H8.46774V5.60108H9.88235V4.20117Z"
            fill="white"
          />
          <path
            d="M8.46774 18.1987H7.05882V19.5986H8.46774V18.1987Z"
            fill="white"
          />
          <path
            d="M8.46774 7.00244H7.05882V8.3967H8.46774V7.00244Z"
            fill="white"
          />
          <path d="M7.0574 19.6001H5.64279V21H7.0574V19.6001Z" fill="white" />
          <path
            d="M7.0574 13.9976H5.64279V15.3975H7.0574V13.9976Z"
            fill="white"
          />
          <path
            d="M7.0574 12.5977H5.64279V13.9976H7.0574V12.5977Z"
            fill="white"
          />
          <path
            d="M7.0574 7.00244H5.64279V8.3967H7.0574V7.00244Z"
            fill="white"
          />
          <path d="M5.64279 19.6001H4.23387V21H5.64279V19.6001Z" fill="white" />
          <path
            d="M5.64279 16.7988H4.23387V18.1987H5.64279V16.7988Z"
            fill="white"
          />
          <path
            d="M5.64279 15.3989H4.23387V16.7988H5.64279V15.3989Z"
            fill="white"
          />
          <path
            d="M5.64279 11.1978H4.23387V12.5977H5.64279V11.1978Z"
            fill="white"
          />
          <path
            d="M5.64279 7.00244H4.23387V8.3967H5.64279V7.00244Z"
            fill="white"
          />
          <path
            d="M4.23388 18.1987H2.81927V19.5986H4.23388V18.1987Z"
            fill="white"
          />
          <path
            d="M4.23388 11.1978H2.81927V12.5977H4.23388V11.1978Z"
            fill="white"
          />
          <MotionPath
            d="M14.1162 11.1979V9.7966H12.7073V8.3967H11.2927V7.00244H9.88236V8.3967H8.46775H7.05883H5.6428H4.23388H2.81927V9.7966H4.23388H5.6428V11.1979H7.05883V12.5978H8.46775V13.9977V15.3991H7.05883V16.799H8.46775H9.88236V15.3991H11.2927H12.7073H14.1162V16.799H15.5266H16.9412V18.1989H18.3501V16.799V15.3991H16.9412V13.9977V12.5978V11.1979H15.5266H14.1162Z"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + delay }}
            fill={fill ? "#FF8C42" : "transparent"}
          />
          <MotionPath
            d="M21.175 8.39661H19.7661H18.3501H16.9412H15.5266V7.00235H14.1162V5.60103V4.20113H12.7073V2.80122V1.3999H11.2927V2.80122V4.20113V5.60103H12.7073V7.00235V8.39661H14.1162V9.79651H15.5266H16.9412V11.1978H18.3501V9.79651H19.7661H21.175H22.5897V8.39661H21.175Z"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + delay }}
            fill={fill ? "#FF8C42" : "transparent"}
          />
          <path
            d="M4.23388 7.00244H2.81927V8.3967H4.23388V7.00244Z"
            fill="white"
          />
          <path
            d="M2.81784 9.79639H1.40892V11.1963H2.81784V9.79639Z"
            fill="white"
          />
          <path
            d="M21.1751 9.79639H19.7661V11.1963H21.1751V9.79639Z"
            fill="#FF741A"
          />
          <path
            d="M19.7647 18.1987H18.3501V19.5986H19.7647V18.1987Z"
            fill="#FF741A"
          />
          <path
            d="M19.7647 9.79639H18.3501V11.1963H19.7647V9.79639Z"
            fill="#FF741A"
          />
          <path
            d="M18.3501 18.1987H16.9412V19.5986H18.3501V18.1987Z"
            fill="#FF741A"
          />
          <path
            d="M18.3501 11.1978H16.9412V12.5977H18.3501V11.1978Z"
            fill="#FF741A"
          />
          <path
            d="M16.9412 16.7988H15.5266V18.1987H16.9412V16.7988Z"
            fill="#FF741A"
          />
          <path
            d="M15.5251 16.7988H14.1162V18.1987H15.5251V16.7988Z"
            fill="#FF741A"
          />
          <path
            d="M14.1162 15.3989H12.7073V16.7988H14.1162V15.3989Z"
            fill="#FF741A"
          />
          <path
            d="M11.2913 15.3989H9.88235V16.7988H11.2913V15.3989Z"
            fill="#FF741A"
          />
          <path
            d="M11.2913 5.60107H9.88235V7.00098H11.2913V5.60107Z"
            fill="#FF741A"
          />
          <path
            d="M11.2913 4.20117H9.88235V5.60108H11.2913V4.20117Z"
            fill="#FF741A"
          />
          <path
            d="M9.88235 16.7988H8.46774V18.1987H9.88235V16.7988Z"
            fill="#FF741A"
          />
          <path
            d="M9.88235 7.00244H8.46774V8.3967H9.88235V7.00244Z"
            fill="#FF741A"
          />
          <path
            d="M8.46774 16.7988H7.05882V18.1987H8.46774V16.7988Z"
            fill="#FF741A"
          />
          <path
            d="M8.46774 13.9976H7.05882V15.3975H8.46774V13.9976Z"
            fill="#FF741A"
          />
          <path
            d="M8.46774 12.5977H7.05882V13.9976H8.46774V12.5977Z"
            fill="#FF741A"
          />
          <path
            d="M7.0574 18.1987H5.64279V19.5986H7.0574V18.1987Z"
            fill="#FF741A"
          />
          <path
            d="M7.0574 16.7988H5.64279V18.1987H7.0574V16.7988Z"
            fill="#FF741A"
          />
          <path
            d="M7.0574 15.3989H5.64279V16.7988H7.0574V15.3989Z"
            fill="#FF741A"
          />
          <path
            d="M7.0574 11.1978H5.64279V12.5977H7.0574V11.1978Z"
            fill="#FF741A"
          />
          <path
            d="M5.64279 18.1987H4.23387V19.5986H5.64279V18.1987Z"
            fill="#FF741A"
          />
          <path
            d="M5.64279 9.79639H4.23387V11.1963H5.64279V9.79639Z"
            fill="#FF741A"
          />
          <path
            d="M4.23388 9.79639H2.81927V11.1963H4.23388V9.79639Z"
            fill="#FF741A"
          />
          <path
            d="M2.81784 8.39648H1.40892V9.79639H2.81784V8.39648Z"
            fill="#FF741A"
          />
          <path
            d="M2.81784 7.00244H1.40892V8.3967H2.81784V7.00244Z"
            fill="white"
          />
          <path d="M1.40892 8.39648H0V9.79639H1.40892V8.39648Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_496_2854">
            <rect width="24" height="21" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
const Star = (props: HTMLMotionProps<"div">) => {
  return (
    <MotionDiv {...props}>
      <svg
        width="40"
        height="37"
        viewBox="0 0 40 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 30.8575L29.3375 36.505C31.0475 37.54 33.14 36.01 32.69 34.075L30.215 23.455L38.4725 16.3C39.98 14.995 39.17 12.52 37.19 12.3625L26.3225 11.44L22.07 1.40496C21.305 -0.417539 18.695 -0.417539 17.93 1.40496L13.6775 11.4175L2.81 12.34C0.829996 12.4975 0.0199955 14.9725 1.5275 16.2775L9.785 23.4325L7.31 34.0525C6.86 35.9875 8.95249 37.5175 10.6625 36.4825L20 30.8575Z"
          fill="white"
        />
      </svg>
    </MotionDiv>
  );
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.4,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Stars = ({ flowEvaluation }: { flowEvaluation: string }) => {
  const score = flowEvaluation.toLowerCase();
  return (
    <div className="flex gap-2">
      <Icon fill />
      <Icon fill={score !== "bad"} className="-translate-y-2" delay={0.3} />
      <Icon fill={score === "good"} delay={0.6} />
    </div>
  );
};
export const MiniStars = ({ flowEvaluation }: { flowEvaluation: string }) => {
  const score = flowEvaluation.toLowerCase();
  return (
    <div className="flex gap-1">
      <Icon fill width={15} height={12} />
      <Icon fill={score !== "bad"} width={15} height={12} delay={0.3} />
      <Icon fill={score === "good"} width={15} height={12} delay={0.6} />
    </div>
  );
};

export default Stars;
