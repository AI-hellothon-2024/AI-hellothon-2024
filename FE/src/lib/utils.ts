import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SelectOption<T> = {
  value: keyof T;
  name: T[keyof T];
};

export function toSelectOptions<T extends object>(kObj: T): SelectOption<T>[] {
  return Object.entries(kObj).map(
    ([value, name]) => ({ value, name } as SelectOption<T>)
  );
}

export function getRandomNumber(start: number, end: number) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
