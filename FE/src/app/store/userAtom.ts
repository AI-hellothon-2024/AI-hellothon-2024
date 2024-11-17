"use client";
import { atomWithStorage } from "jotai/utils";

export const userIdAtom = atomWithStorage("userId", window.crypto.randomUUID());
