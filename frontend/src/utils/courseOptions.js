// src/utils/courseOptions.js
export const groupOptions = ["ROOT", "STEM", "LEAF", "FLOWER", "FRUIT", "SEED"];

export const standardOptions = {
  ROOT: ["1st", "2nd", "3rd", "4th"],
  STEM: ["5th", "6th", "7th", "8th"],
  LEAF: ["9th", "10th", "11th", "12th"],
  FLOWER: ["Entrance Exam"],
  FRUIT: ["Government Exam"],
  SEED: ["Skill Development"],
};

export const boardOptions = ["State Board", "CBSE", "ICSE"];
export const languageOptions = ["English", "Tamil", "Hindi"];

export const subjectMap = {
  ROOT: ["Tamil", "English", "Maths", "Science", "Social Science"],
  STEM: ["Tamil", "English", "Maths", "Science", "Social Science"],
  LEAF: [
    "Tamil",
    "English",
    "Maths",
    "Science",
    "Social Science",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Zoology",
    "Botany",
    "Business Maths",
    "Statistics",
    "Political Science",
    "Geography",
    "Civics",
    "Business Studies",
    "Economics",
    "Accountancy",
  ],
  FLOWER: ["NEET", "JEE", "Aptitude"],
  FRUIT: ["TNPSC", "UPSC", "SSC", "Bank Exams", "Railway"],
  SEED: ["C Programming", "C++", "Java", "Python", "Web Dev", "React", "Flutter"],
};

export const lessonOptions = Array.from({ length: 20 }, (_, i) => `Lesson ${i + 1}`);
