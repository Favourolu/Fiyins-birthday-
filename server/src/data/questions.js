// Fiyin's Birthday Aptitude Challenge — harder question set (v2).
// Same 4 sections and participant names as the original questionnaire, but
// considerably harder. correctAnswer is a fixed, explicit value per
// question — never derived at runtime.
const QUESTIONS = [
  {
    id: 1,
    section: "Verbal Reasoning",
    question:
      "Murewa was praised as PERSPICACIOUS during the birthday trivia round. Choose the word closest in meaning to PERSPICACIOUS.",
    options: ["Naive", "Astute", "Reckless", "Indifferent", "Verbose"],
    correctAnswer: "Astute",
  },
  {
    id: 2,
    section: "Verbal Reasoning",
    question:
      "Chiamaka thought Deo's compliments at the party were OBSEQUIOUS. Choose the word opposite in meaning to OBSEQUIOUS.",
    options: ["Servile", "Fawning", "Blunt", "Ingratiating", "Sycophantic"],
    correctAnswer: "Blunt",
  },
  {
    id: 3,
    section: "Verbal Reasoning",
    question:
      "All party planners who manage the guest list also manage the budget. Some people who manage the budget do not manage the venue. Anne is a party planner who manages the guest list. Which conclusion must be true?",
    options: [
      "Anne does not manage the venue.",
      "Anne manages the budget.",
      "Anne manages the venue.",
      "No one who manages the guest list manages the venue.",
      "Everyone who manages the budget manages the guest list.",
    ],
    correctAnswer: "Anne manages the budget.",
  },
  {
    id: 4,
    section: "Verbal Reasoning",
    question:
      "Pelumi's explanation of the treasure hunt rules was so ________ that even after three repetitions, half the guests still misunderstood the starting point.",
    options: ["Lucid", "Convoluted", "Meticulous", "Concise", "Transparent"],
    correctAnswer: "Convoluted",
  },
  {
    id: 5,
    section: "Problem Solving",
    question:
      "Eniola can decorate the party hall alone in 8 hours. Working together with Pipe, they finish in 3 hours. How long would Pipe take to decorate the hall alone?",
    options: ["4.8 hours", "5 hours", "5.5 hours", "6 hours", "4.5 hours"],
    correctAnswer: "4.8 hours",
  },
  {
    id: 6,
    section: "Problem Solving",
    question:
      "Ore's savings first increased by 20%, then decreased by 25%, ending at ₦72,000. What was the original amount?",
    options: ["₦75,000", "₦78,000", "₦80,000", "₦82,500", "₦90,000"],
    correctAnswer: "₦80,000",
  },
  {
    id: 7,
    section: "Problem Solving",
    question:
      "Deo drove from the venue to the mall at 60 km/h and returned along the same route at 40 km/h. What was his average speed for the entire round trip?",
    options: ["50 km/h", "48 km/h", "45 km/h", "52 km/h", "47 km/h"],
    correctAnswer: "48 km/h",
  },
  {
    id: 8,
    section: "Problem Solving",
    question:
      "Delight, Prisca and Chioma set up chairs in the ratio 2:3:5 of the total needed. If Chioma set up 24 more chairs than Delight, how many chairs did Prisca set up?",
    options: ["16", "20", "24", "28", "32"],
    correctAnswer: "24",
  },
  {
    id: 9,
    section: "Critical Thinking",
    question:
      'Anjola argues: "Every year the birthday committee has served jollof rice, and every year the party has been a success. Therefore, serving jollof rice causes the party to succeed." What is the primary flaw in this reasoning?',
    options: [
      "It relies on a false dichotomy.",
      "It confuses correlation with causation.",
      "It uses circular reasoning.",
      "It appeals to popularity.",
      "It contains a contradiction.",
    ],
    correctAnswer: "It confuses correlation with causation.",
  },
  {
    id: 10,
    section: "Critical Thinking",
    question:
      'Serah claims: "Since the guest list has grown every year for the past five years, we should book a venue twice the size of last year\'s to be safe." Which of the following, if true, would most weaken Serah\'s argument?',
    options: [
      "The venue used last year had some empty space.",
      "This year, several long-time attendees have said they cannot attend due to travel conflicts.",
      "The committee has more money to spend this year.",
      "A bigger venue costs more to decorate.",
      "The party will be held on a weekend this year.",
    ],
    correctAnswer:
      "This year, several long-time attendees have said they cannot attend due to travel conflicts.",
  },
  {
    id: 11,
    section: "Critical Thinking",
    question:
      "Chioma notices that guests who arrived within the first 30 minutes reported higher satisfaction scores than those who arrived late. She concludes early arrival causes higher satisfaction. Which finding would most strengthen her conclusion?",
    options: [
      "Guests who arrived early were randomly assigned arrival times, and even after accounting for this, they still reported higher satisfaction.",
      "The survey had 200 respondents.",
      "Guests who arrived early tended to know the host personally.",
      "The party had good weather that day.",
      "Late guests missed the opening speech.",
    ],
    correctAnswer:
      "Guests who arrived early were randomly assigned arrival times, and even after accounting for this, they still reported higher satisfaction.",
  },
  {
    id: 12,
    section: "Critical Thinking",
    question:
      'Idowu says: "Alex missed the trivia question about capital cities, so Alex clearly didn\'t study geography at all." What is the strongest criticism of Idowu\'s statement?',
    options: [
      "Missing one question does not establish that Alex did not study geography at all.",
      "Idowu should not discuss Alex's performance publicly.",
      "Trivia questions are not a fair way to test knowledge.",
      "Alex may not enjoy geography.",
      "The capital cities question was too difficult for anyone to answer.",
    ],
    correctAnswer: "Missing one question does not establish that Alex did not study geography at all.",
  },
  {
    id: 13,
    section: "Quantitative Reasoning",
    question:
      "Murewa's prize fund increased by 10% in the first month and by a further 10% in the second month. By what overall percentage did the fund increase after two months?",
    options: ["20%", "21%", "22%", "19%", "24%"],
    correctAnswer: "21%",
  },
  {
    id: 14,
    section: "Quantitative Reasoning",
    question:
      "At Fiyin's second birthday event, the ratio of boys to girls was 4:7. After 20 more girls arrived and no boys left, the ratio became 4:11. How many boys were at the event?",
    options: ["16", "18", "20", "24", "28"],
    correctAnswer: "20",
  },
  {
    id: 15,
    section: "Quantitative Reasoning",
    question:
      "Anjola is playing a number game with Eniola. What is the next number in the sequence? 2, 3, 7, 16, 32, ________",
    options: ["54", "57", "60", "64", "50"],
    correctAnswer: "57",
  },
  {
    id: 16,
    section: "Quantitative Reasoning",
    question:
      "A box contains 5 red, 4 blue, and 3 green balls. Pipe draws two balls at random without replacement. What is the probability that both balls are red?",
    options: ["5/33", "1/6", "5/44", "2/11", "5/22"],
    correctAnswer: "5/33",
  },
  {
    id: 17,
    section: "Quantitative Reasoning",
    question:
      "In a room of 120 guests, 40% are wearing red. If a number of red-wearing guests leave and no one else leaves, the percentage wearing red drops to 25%. How many guests left the room?",
    options: ["18", "20", "22", "24", "30"],
    correctAnswer: "24",
  },
];

module.exports = { QUESTIONS };
