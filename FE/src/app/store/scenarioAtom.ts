"use client";
import { atomWithStorage } from "jotai/utils";

export const scenarioAtom = atomWithStorage<string[]>("scenarioIds", []);
