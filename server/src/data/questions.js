// Source of truth: Fiyin's Birthday Aptitude Challenge questionnaire.
// Question text, options, section names and order are preserved exactly as given.
// correctAnswer is a fixed, explicit value per question — never derived at runtime.
const QUESTIONS = [
  {
    id: 1,
    section: "Verbal Reasoning",
    question:
      "Murewa was RELUCTANT to join the birthday dance competition. Choose the word closest in meaning to RELUCTANT.",
    options: ["Eager", "Unwilling", "Confident", "Certain", "Cheerful"],
    correctAnswer: "Unwilling",
  },
  {
    id: 2,
    section: "Verbal Reasoning",
    question:
      "Mayokun complained that birthday cake was SCARCE. Choose the word opposite in meaning to SCARCE.",
    options: ["Rare", "Limited", "Abundant", "Small", "Insufficient"],
    correctAnswer: "Abundant",
  },
  {
    id: 3,
    section: "Verbal Reasoning",
    question:
      "All engineers in the birthday planning committee enjoy problem-solving. Idowu is an engineer in the committee. Which conclusion must be true?",
    options: [
      "Idowu dislikes problem-solving.",
      "Idowu enjoys problem-solving.",
      "Everyone who enjoys problem-solving is an engineer.",
      "Idowu is the best engineer.",
      "No non-engineers enjoy problem-solving.",
    ],
    correctAnswer: "Idowu enjoys problem-solving.",
  },
  {
    id: 4,
    section: "Verbal Reasoning",
    question:
      "Pelumi gave Eniola and Anne instructions for one of the birthday games. The instructions were so ________ that everyone completed the task without asking questions.",
    options: ["Ambiguous", "Confusing", "Clear", "Lengthy", "Uncertain"],
    correctAnswer: "Clear",
  },
  {
    id: 5,
    section: "Problem Solving",
    question:
      "Ore bought a birthday shirt costing ₦12,000. It was discounted by 25%. What was the sale price?",
    options: ["₦8,000", "₦9,000", "₦9,500", "₦10,000", "₦10,500"],
    correctAnswer: "₦9,000",
  },
  {
    id: 6,
    section: "Problem Solving",
    question:
      "Alex's bus travels 180 km in 3 hours. At the same speed, how far will it travel in 5 hours?",
    options: ["240 km", "270 km", "300 km", "320 km", "360 km"],
    correctAnswer: "300 km",
  },
  {
    id: 7,
    section: "Problem Solving",
    question:
      "If Delight, Anjola, Pipe, Prisca and Chioma can complete a birthday setup in 12 days at the same rate, how many days would 10 friends need?",
    options: ["3", "5", "6", "8", "10"],
    correctAnswer: "6",
  },
  {
    id: 8,
    section: "Problem Solving",
    question:
      "Fiyin's birthday savings increased by 20% and became ₦72,000. What was the original amount?",
    options: ["₦50,000", "₦55,000", "₦60,000", "₦62,000", "₦65,000"],
    correctAnswer: "₦60,000",
  },
  {
    id: 9,
    section: "Critical Thinking",
    question:
      'Deo says: "Everyone who came early to Fiyin’s birthday got a seat, so coming early guarantees getting a seat." What is the main weakness in this reasoning?',
    options: [
      "It uses too many examples.",
      "It assumes a relationship from limited evidence.",
      "It contradicts the definition of a seat.",
      "It proves that late arrivals get seats.",
      "It uses a mathematical formula.",
    ],
    correctAnswer: "It assumes a relationship from limited evidence.",
  },
  {
    id: 10,
    section: "Critical Thinking",
    question:
      "Chioma visits a restaurant that receives 10 five-star reviews after changing its menu. The owner concludes the new menu is definitely better. Which additional information would best test this conclusion?",
    options: [
      "The colour of the menu.",
      "How many customers visited before and after the change.",
      "The owner's favourite dish.",
      "The restaurant's opening time.",
      "The number of tables in the restaurant.",
    ],
    correctAnswer: "How many customers visited before and after the change.",
  },
  {
    id: 11,
    section: "Critical Thinking",
    question:
      "Anne argues: \"We should buy more speakers because louder music will make Fiyin's birthday party more fun.\" Which statement is an assumption in this argument?",
    options: [
      "The party has guests.",
      "The speakers are available to buy.",
      "Louder music will make the guests have more fun.",
      "Music exists.",
      "The party has a location.",
    ],
    correctAnswer: "Louder music will make the guests have more fun.",
  },
  {
    id: 12,
    section: "Critical Thinking",
    question:
      'Prisca says: "I studied for one hour and failed, so studying does not help." Which response is the strongest critical-thinking response?',
    options: [
      "Studying always guarantees success.",
      "One experience is not enough evidence to conclude that studying is ineffective.",
      "The student should never study again.",
      "Failure means the exam was unfair.",
      "Everyone learns in exactly the same way.",
    ],
    correctAnswer:
      "One experience is not enough evidence to conclude that studying is ineffective.",
  },
  {
    id: 13,
    section: "Quantitative Reasoning",
    question: "Anjola is calculating the food budget. What is 15% of 240?",
    options: ["24", "30", "36", "40", "45"],
    correctAnswer: "36",
  },
  {
    id: 14,
    section: "Quantitative Reasoning",
    question:
      "At Fiyin's birthday event, the ratio of boys to girls is 3:5. If 24 boys are attending, how many girls are there?",
    options: ["30", "36", "40", "45", "48"],
    correctAnswer: "40",
  },
  {
    id: 15,
    section: "Quantitative Reasoning",
    question:
      "Delight is playing a number game with Eniola. What is the next number in the sequence? 3, 6, 12, 24, ________",
    options: ["30", "36", "42", "48", "54"],
    correctAnswer: "48",
  },
  {
    id: 16,
    section: "Quantitative Reasoning",
    question:
      "A box contains 4 red, 3 blue, and 3 green balls. If Pipe chooses one ball at random, what is the probability that it is blue?",
    options: ["1/2", "1/3", "3/10", "2/5", "3/7"],
    correctAnswer: "3/10",
  },
  {
    id: 17,
    section: "Quantitative Reasoning",
    question:
      "In a room of 100 people, 99% are left-handed. How many left-handed people have to leave the room to bring that percentage down to 98%?",
    options: ["1", "2", "25", "50", "75"],
    correctAnswer: "1",
  },
];

module.exports = { QUESTIONS };
