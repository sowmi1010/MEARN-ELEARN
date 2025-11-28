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

export const boardOptions = ["Tamil Nadu", "CBSE"];
export const languageOptions = ["Tamil", "English"];

export const subjectMap = {

  // ROOT – Class 1 to 4
  ROOT: ["Tamil", "English", "Maths", "Science", "Social Science"],

  // STEM – Class 5 to 8
  STEM: ["Tamil", "English", "Maths", "Science", "Social Science"],

  // LEAF – Class 9 to 12 (SMART STRUCTURE)
  LEAF: {

    // ✅ 9th & 10th – ONLY BASIC 5
    "9th": [
      "Tamil",
      "English",
      "Maths",
      "Science",
      "Social Science"
    ],

    "10th": [
      "Tamil",
      "English",
      "Maths",
      "Science",
      "Social Science"
    ],

    // ✅ 11th & 12th – BIO MATHS
    "11th-BIO MATHS": [
      "Tamil",
      "English",
      "Maths",
      "Physics",
      "Chemistry",
      "Biology"
    ],

    "12th-BIO MATHS": [
      "Tamil",
      "English",
      "Maths",
      "Physics",
      "Chemistry",
      "Biology"
    ],

    // ✅ 11th & 12th – COMPUTER GROUP
    "11th-COMPUTER": [
      "Tamil",
      "English",
      "Maths",
      "Physics",
      "Chemistry",
      "Computer Science"
    ],

    "12th-COMPUTER": [
      "Tamil",
      "English",
      "Maths",
      "Physics",
      "Chemistry",
      "Computer Science"
    ],

    // ✅ 11th & 12th – COMMERCE GROUP
    "11th-COMMERCE": [
      "Tamil",
      "English",
      "Accountancy",
      "Business Maths",
      "Economics",
      "Statistics"
    ],

    "12th-COMMERCE": [
      "Tamil",
      "English",
      "Accountancy",
      "Business Maths",
      "Economics",
      "Statistics"
    ]
  },

  // FLOWER – Entrance
  FLOWER: ["NEET", "JEE", "Aptitude"],

  // FRUIT – Government
  FRUIT: ["TNPSC", "UPSC", "SSC", "Bank Exams", "Railway"],

  // SEED – Skills
  SEED: ["C Programming", "C++", "Java", "Python", "Web Dev", "React", "Flutter"],

};


export const lessonOptions = Array.from({ length: 20 }, (_, i) => `Lesson ${i + 1}`);
