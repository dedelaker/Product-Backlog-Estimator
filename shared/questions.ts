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
    text: "Do we have to integrate an external partner?",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, standard API, already used by lot of other clients", score: 50 },
      { text: "Yes, but partner creates specifications for us", score: 100 },
      { text: "Yes, we need to create specifications", score: 150 },
      { text: "Yes, complex integration with multiple partners", score: 200 }
    ]
  },
  {
    id: "data_complexity",
    text: "What is the data complexity level?",
    options: [
      { text: "Simple data structures", score: 10 },
      { text: "Moderate data complexity", score: 30 },
      { text: "Complex data relationships", score: 75 },
      { text: "Very complex data modeling required", score: 120 }
    ]
  },
  {
    id: "ui_complexity",
    text: "How complex is the user interface?",
    options: [
      { text: "Simple forms and lists", score: 15 },
      { text: "Standard UI components", score: 40 },
      { text: "Custom UI components needed", score: 80 },
      { text: "Complex interactive interface", score: 150 }
    ]
  },
  {
    id: "business_logic",
    text: "What is the business logic complexity?",
    options: [
      { text: "Simple CRUD operations", score: 20 },
      { text: "Moderate business rules", score: 50 },
      { text: "Complex business workflows", score: 100 },
      { text: "Very complex business logic with multiple conditions", score: 180 }
    ]
  },
  {
    id: "testing_requirements",
    text: "What are the testing requirements?",
    options: [
      { text: "Basic unit tests", score: 10 },
      { text: "Standard testing coverage", score: 25 },
      { text: "Comprehensive testing including integration", score: 50 },
      { text: "Extensive testing with multiple environments", score: 80 }
    ]
  }
];