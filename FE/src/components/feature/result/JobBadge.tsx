import React from "react";
import { Badge } from "@/components/ui/badge";
import { JOBS } from "@/lib/constants";

interface Props {
  job: keyof typeof JOBS;
}
const JobBadge = ({ job }: Props) => {
  switch (job) {
    case "developer":
      return (
        <Badge className="bg-[rgba(68,160,152,0.5)] text-white px-2 py-1">
          {JOBS[job]}
        </Badge>
      );
    case "designer":
      return (
        <Badge className="bg-[rgba(69,107,145,0.5)] text-white px-2 py-1">
          {JOBS[job]}
        </Badge>
      );
    case "productManager":
      return (
        <Badge className="bg-[rgba(255,140,66,0.5)] text-white px-2 py-1">
          {JOBS[job]}
        </Badge>
      );
    default:
      return null;
  }
};

export default JobBadge;
