import type { MatchResult } from "./types";

export interface SavedMatch {
  id: string;
  jobTitle: string;
  jobDescription: string;
  cvFileName: string;
  result: MatchResult;
  createdAt: string;
  notes?: string;
}

const STORAGE_KEY = "ats_matches";

export function saveMatch(
  jobTitle: string,
  jobDescription: string,
  cvFileName: string,
  result: MatchResult
): SavedMatch {
  const match: SavedMatch = {
    id: Date.now().toString(),
    jobTitle,
    jobDescription,
    cvFileName,
    result,
    createdAt: new Date().toISOString(),
  };

  const matches = getAllMatches();
  matches.unshift(match);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));

  return match;
}

export function getAllMatches(): SavedMatch[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteMatch(id: string): void {
  const matches = getAllMatches();
  const filtered = matches.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateMatchNotes(id: string, notes: string): void {
  const matches = getAllMatches();
  const match = matches.find((m) => m.id === id);
  if (match) {
    match.notes = notes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }
}
