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
    case "passWork":
      return <Angry fill={fill} className={className} />;
    case "codeReview":
      return <Geer fill={fill} className={className} />;
    case "nastyClient":
      return <Light fill={fill} className={className} />;
    case "bubbles":
      return <Cloud fill={fill} className={className} />;
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
const Geer = ({
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
        d="M50.01 65.75C45.8111 65.75 41.7841 64.0906 38.8151 61.1369C35.846 58.1832 34.178 54.1772 34.178 50C34.178 45.8228 35.846 41.8168 38.8151 38.8631C41.7841 35.9094 45.8111 34.25 50.01 34.25C54.2089 34.25 58.2358 35.9094 61.2049 38.8631C64.174 41.8168 65.842 45.8228 65.842 50C65.842 54.1772 64.174 58.1832 61.2049 61.1369C58.2358 64.0906 54.2089 65.75 50.01 65.75ZM87.0678 57.0642C84.9287 55.39 83.9357 52.7164 83.9357 50V50V50C83.9357 47.2009 84.9787 44.4552 87.1981 42.7495L93.1636 38.165C94.023 37.49 94.2492 36.275 93.7064 35.285L84.6595 19.715C84.1167 18.725 82.8954 18.32 81.9002 18.725L74.6653 21.6155C72.1626 22.6154 69.395 22.2019 67.0763 20.8281V20.8281C64.6761 19.4061 62.7526 17.1074 62.3648 14.3447L61.3186 6.89001C61.2267 6.35999 60.9492 5.87943 60.5352 5.53349C60.1212 5.18755 59.5975 4.99856 59.0569 5.00001H40.9631C39.8323 5.00001 38.8823 5.81001 38.7014 6.89001L37.6551 14.3447C37.2674 17.1074 35.3439 19.4061 32.9437 20.8281V20.8281C30.625 22.2019 27.8574 22.6154 25.3546 21.6155L18.1198 18.725C17.1246 18.32 15.9033 18.725 15.3605 19.715L6.31362 35.285C5.72557 36.275 5.99698 37.49 6.85643 38.165L12.8219 42.7495C15.0413 44.4552 16.0842 47.2009 16.0842 50V50V50C16.0842 52.7164 15.0913 55.39 12.9522 57.0642L6.85643 61.835C5.99698 62.51 5.72557 63.725 6.31362 64.715L15.3605 80.285C15.9033 81.275 17.1246 81.635 18.1198 81.275L25.3113 78.3731C27.835 77.3547 30.6397 77.7942 32.9781 79.1864V79.1864C35.3605 80.6049 37.2659 82.8821 37.6513 85.628L38.7014 93.11C38.8823 94.19 39.8323 95 40.9631 95H59.0569C60.1877 95 61.1376 94.19 61.3186 93.11L62.3737 85.5921C62.7568 82.8627 64.6378 80.5867 67.0122 79.1872V79.1872C69.3746 77.7948 72.1968 77.3595 74.7397 78.3856L81.9002 81.275C82.8954 81.635 84.1167 81.275 84.6595 80.285L93.7064 64.715C94.2492 63.725 94.023 62.51 93.1636 61.835L87.0678 57.0642Z"
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

const Light = ({
  fill = "url(#paint0_linear_479_6895)",
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M45.8935 7.70212C47.3973 4.27719 52.0288 4.11045 53.844 7.18838L54.1065 7.70212L58.7424 18.2698C62.7905 27.4942 69.5225 35.247 78.0381 40.4913L79.4707 41.343L87.7015 46.0298C88.3558 46.4008 88.9081 46.9318 89.3079 47.5744C89.7078 48.217 89.9425 48.9507 89.9907 49.7087C90.0389 50.4667 89.8991 51.2249 89.5839 51.9141C89.2688 52.6034 88.7884 53.2017 88.1864 53.6548L87.7059 53.9702L79.4707 58.657C70.7833 63.6067 63.7952 71.1252 59.4409 80.207L58.7424 81.7302L54.1065 92.2979C52.6027 95.7228 47.9712 95.8896 46.156 92.8116L45.8935 92.2979L41.2576 81.7302C37.2095 72.5058 30.4775 64.753 21.9619 59.5087L20.5293 58.657L12.2985 53.9702C11.6442 53.5992 11.0919 53.0682 10.6921 52.4256C10.2922 51.783 10.0575 51.0493 10.0093 50.2913C9.96109 49.5333 10.1009 48.7751 10.4161 48.0859C10.7312 47.3966 11.2116 46.7983 11.8136 46.3452L12.2941 46.0298L20.5293 41.343C29.2167 36.3933 36.2048 28.8748 40.5591 19.793L41.2576 18.2698L45.8935 7.70212Z"
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
const Cloud = ({
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
