"use client";
import { atomWithStorage } from "jotai/utils";

interface ResultDto {
  userId: string;
  scenarioIds: string[];
}

export const resultAtom = atomWithStorage<ResultDto[]>("result", []);
