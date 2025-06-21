import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreColorClasses(score: number) {
  let scoreColorClass: string;
  let scoreBgClass: string;
  let complexityBadgeClass: string;

  if (score >= 500) {
    scoreColorClass = 'text-red-500';
    scoreBgClass = 'bg-red-100';
    complexityBadgeClass = 'bg-red-100 text-red-800';
  } else if (score >= 200) {
    scoreColorClass = 'text-yellow-600';
    scoreBgClass = 'bg-yellow-100';
    complexityBadgeClass = 'bg-yellow-100 text-yellow-800';
  } else if (score >= 100) {
    scoreColorClass = 'text-green-600';
    scoreBgClass = 'bg-green-100';
    complexityBadgeClass = 'bg-green-100 text-green-800';
  } else {
    scoreColorClass = 'text-lime-600';
    scoreBgClass = 'bg-lime-100';
    complexityBadgeClass = 'bg-lime-100 text-lime-800';
  }

  return { scoreColorClass, scoreBgClass, complexityBadgeClass };
}
