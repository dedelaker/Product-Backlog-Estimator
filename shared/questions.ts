export interface QuestionOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export const ESTIMATION_QUESTIONS: Question[] = [
  {
    id: "external_integration",
    text: "Do we have to integrate or adapt solution of an external partner? (could be on YS side or in other teams)",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, standard API, already used by lot of other clients", score: 100 },
      { text: "Yes, but partner creates specifications for us", score: 250 },
      { text: "No, but we have to enhance their system drastically", score: 75 }
    ]
  },
  {
    id: "app_touch",
    text: "Do we have to touch all the part of the app (MPSA)?",
    options: [
      { text: "Yes", score: 100 },
      { text: "No, but 2 YS squads impacted", score: 75 },
      { text: "No only 1 squad", score: 30 }
    ]
  },
  {
    id: "new_business",
    text: "New business for Company 1",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, but already exists at Company 2", score: 50 },
      { text: "Yes for 1 & 2, but not complex", score: 100 },
      { text: "Yes for 1 & 2, and complex", score: 150 }
    ]
  },
  {
    id: "future_scope",
    text: "Future scope is clear?",
    options: [
      { text: "Yes, clear and probability of change is very low", score: 50 },
      { text: "Yes, but high probability of change is high", score: 75 },
      { text: "No", score: 100 }
    ]
  },
  {
    id: "swe_dependencies",
    text: "Do we have very high dependencies with SWE 1 or SWE 9?",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, high impact on multiple teams", score: 300 },
      { text: "Yes, high impact on one team or medium impact on multiple teams", score: 150 },
      { text: "Yes, but small impacts", score: 50 }
    ]
  },
  {
    id: "fraud_compliance",
    text: "Do we have impacts on Fraud/Compliance workflows",
    options: [
      { text: "No", score: 0 },
      { text: "Yes", score: 30 }
    ]
  },
  {
    id: "it_dependencies",
    text: "Do we have IT dependencies about new hardware to order",
    options: [
      { text: "No", score: 0 },
      { text: "Yes", score: 50 }
    ]
  },
  {
    id: "security_analysis",
    text: "Do we have complex analysis of IT security? or Legal? (ex: for big impacts / critical outsourcing, AI guidelines)",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, with potential big impacts on solution", score: 150 },
      { text: "Yes, but no impact on solution", score: 20 }
    ]
  },
  {
    id: "new_technology",
    text: "Do we have to use a new technology?",
    options: [
      { text: "No", score: 0 },
      { text: "Yes", score: 100 }
    ]
  },
  {
    id: "new_architecture",
    text: "Do we have to put in place a new architecture?",
    options: [
      { text: "No, only upgrade on current one", score: 0 },
      { text: "Yes, but a new small piece", score: 30 },
      { text: "Yes, and big impact on current one", score: 100 }
    ]
  }
];