import React from "react";
import { SITUATIONS } from "@/lib/constants";

const SituationIcon = ({
  situation,
  fill = "url(#paint0_linear_479_6895)",
  className,
}: {
  situation: keyof typeof SITUATIONS;
  fill?: string;
  className?: string;
}) => {
  switch (situation) {
    case "love":
      return <Love fill={fill} className={className} />;
    case "angry":
      return <Angry fill={fill} className={className} />;
    case "daily":
      return <Daily fill={fill} className={className} />;
    default:
      return null;
  }
};

const Love = ({
  fill = "url(#paint0_linear_479_6895)",
  className,
}: {
  fill?: string;
  className?: string;
}) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M70.1443 6C84.6235 6 96 17.352 96 31.8C96 48.8853 81.291 62.76 58.7677 83.2853L55.7799 85.808L49 92L42.2201 85.808L39.9218 84.088C17.0538 63.104 2 49 2 31.8C2 17.352 13.3765 6 27.8557 6C36.0147 6 43.8289 9.89867 49 15.8613C54.1711 9.89867 62.1002 6 70.1443 6Z"
        fill={fill}
      />
      <defs>
        <linearGradient
          id="paint0_linear_479_6895"
          x1="79.6449"
          y1="109.981"
          x2="142.395"
          y2="61.9466"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8C42" />
          <stop offset="1" stopColor="#FF7318" />
        </linearGradient>
      </defs>
    </svg>
  );
};
const Angry = ({
  fill = "url(#paint0_linear_479_6895)",
  className,
}: {
  fill?: string;
  className?: string;
}) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M37.1783 4C36.112 4 35.0743 4.29345 34.2212 4.8363C33.3681 5.37916 32.7455 6.14212 32.447 7.01069L15.1971 57.1888C14.9829 57.812 14.9426 58.469 15.0795 59.1077C15.2164 59.7464 15.5266 60.3492 15.9857 60.8686C16.4448 61.3879 17.0401 61.8094 17.7244 62.0997C18.4088 62.39 19.1634 62.5412 19.9285 62.5412H38.9871L34.7486 91.2933C34.609 92.2289 34.8462 93.1771 35.4219 93.9839C35.9975 94.7907 36.8777 95.4087 37.9195 95.7375C38.9613 96.0664 40.1035 96.0868 41.1607 95.7954C42.2179 95.5041 43.128 94.918 43.7431 94.1325L83.1713 43.9544C83.6665 43.3246 83.9509 42.5926 83.9942 41.8365C84.0375 41.0803 83.838 40.3284 83.4171 39.6609C82.9961 38.9934 82.3695 38.4354 81.604 38.0464C80.8386 37.6574 79.963 37.452 79.0707 37.4521H61.54L73.8268 9.64922C74.1063 9.01673 74.2009 8.3362 74.1028 7.66588C74.0046 6.99556 73.7165 6.3554 73.2631 5.80016C72.8097 5.24493 72.2045 4.79114 71.4993 4.47764C70.7941 4.16414 70.0099 4.00025 69.2137 4H37.1783Z"
        fill={fill}
      />
      <defs>
        <linearGradient
          id="paint0_linear_479_6895"
          x1="79.6449"
          y1="109.981"
          x2="142.395"
          y2="61.9466"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8C42" />
          <stop offset="1" stopColor="#FF7318" />
        </linearGradient>
      </defs>
    </svg>
  );
};
const Daily = ({
  fill = "url(#paint0_linear_479_6895)",
  className,
}: {
  fill?: string;
  className?: string;
}) => {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.5 78C19.9167 78 13.4383 75.3133 8.065 69.94C2.69167 64.5667 0.00333333 58.0867 0 50.5C0 43.5833 2.29167 37.5417 6.875 32.375C11.4583 27.2083 17.125 24.1667 23.875 23.25C26.5417 18.5 30.1883 14.77 34.815 12.06C39.4417 9.35001 44.5033 7.99667 50 8.00001C57.5 8.00001 64.0217 10.3967 69.565 15.19C75.1083 19.9833 78.4617 25.9617 79.625 33.125C85.375 33.625 90.2083 36 94.125 40.25C98.0417 44.5 100 49.5833 100 55.5C100 61.75 97.8133 67.0633 93.44 71.44C89.0667 75.8167 83.7533 78.0033 77.5 78H27.5Z"
        fill={fill}
      />
      <defs>
        <linearGradient
          id="paint0_linear_479_6895"
          x1="79.6449"
          y1="109.981"
          x2="142.395"
          y2="61.9466"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8C42" />
          <stop offset="1" stopColor="#FF7318" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SituationIcon;
// fill=
