"use client";

export function useMinimumSelection(selectedCount: number, minimumRequired = 2) {
  const remainingCount = Math.max(0, minimumRequired - selectedCount);

  return {
    selectedCount,
    minimumRequired,
    remainingCount,
    isComplete: selectedCount >= minimumRequired,
    progressValue: Math.min(selectedCount, minimumRequired),
  };
}
