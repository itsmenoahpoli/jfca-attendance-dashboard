export const gradeLevels = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "1st Year College",
  "2nd Year College",
  "3rd Year College",
  "4th Year College",
] as const;

export type GradeLevel = (typeof gradeLevels)[number];
