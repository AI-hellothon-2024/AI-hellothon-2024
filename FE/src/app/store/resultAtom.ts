"use client";
import { atomWithStorage } from "jotai/utils";

interface ResultDto {
  userId: string;
  resultId: string;
}

export const resultAtom = atomWithStorage<ResultDto[]>("result", []);
