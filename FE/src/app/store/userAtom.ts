"use client";
import { atomWithStorage } from "jotai/utils";

export const userIdAtom = atomWithStorage<string>("userIdAtom", "");
