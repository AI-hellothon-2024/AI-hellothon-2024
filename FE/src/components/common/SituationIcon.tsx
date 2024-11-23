import React from "react";
import { SITUATIONS } from "@/lib/constants";

const SituationIcon = ({
  situation,
}: {
  situation: keyof typeof SITUATIONS;
}) => {
  switch (situation) {
    case "love":
      return <Love />;
    case "angry":
      return <Angry />;
    case "daily":
      return <Daily />;
    default:
      return null;
  }
};

const Love = () => {
  return <div className="w-[100px] aspect-square">Love</div>;
};
const Angry = () => {
  return <div className="w-[100px] aspect-square">Angry</div>;
};
const Daily = () => {
  return <div className="w-[100px] aspect-square">Daily</div>;
};

export default SituationIcon;
