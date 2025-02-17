import { render, screen } from '../test-utils';
import CurriculumRecommendation from '../components/CurriculumRecommendation';
import '@testing-library/jest-dom';

// Mock getTotalQuestions function
const mockGetTotalQuestions = () => 10; // Total number of questions in our mock data

// Mock survey data
jest.mock('../data/surveyData', () => ({
  surveyData: {
    title: "Test Survey",
    sections: [
      {
        title: "Presentations",
        modules: [
          {
            id: "presentations_1",
            title: "Basic Presentations",
            skills: [
              "Delivering presentations",
              "Creating slides"
            ]
          },
          {
            id: "presentations_2",
            title: "Advanced Presentations",
            skills: [
              "Handling Q&A",
              "Visual aids"
            ]
          }
        ]
      },
      {
        title: "Meetings",
        modules: [
          {
            id: "meetings_1",
            title: "Meeting Skills",
            skills: [
              "Leading meetings",
              "Taking notes"
            ]
          }
        ]
      }
    ]
  }
}));

describe('CurriculumRecommendation', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  const completeResponses = {
    "presentations_1_0": "very-important",
    "presentations_1_1": "important",
    "presentations_2_0": "neutral",
    "presentations_2_1": "very-important",
    "meetings_1_0": "important",
    "meetings_1_1": "very-important"
  };

  const partialResponses = {
    "presentations_1_0": "very-important",
    "presentations_1_1": "important",
    "presentations_2_0": "neutral"
  };

  const minimalResponses = {
    "presentations_1_0": "very-important"
  };

  test('renders complete response recommendations without warnings', () => {
    render(<CurriculumRecommendation responses={completeResponses} clientName="Test User 1" />);
    
    // Should not show warning
    expect(screen.queryByText(/only.*% of questions were answered/i)).toBeNull();
    
    // Should show curriculum plan
    expect(screen.getByText(/curriculum recommendations for test user 1/i)).toBeInTheDocument();
    
    // Should show implementation notes
    expect(screen.getByText(/high-priority modules \(red\) should be covered in depth/i)).toBeInTheDocument();
  });

  test('renders partial response recommendations with warning', () => {
    render(<CurriculumRecommendation responses={partialResponses} clientName="Test User 2" />);
    
    // Should show warning about partial completion
    expect(screen.getByText(/questions were answered/i)).toBeInTheDocument();
    
    // Should still show curriculum plan
    expect(screen.getByText(/curriculum recommendations for test user 2/i)).toBeInTheDocument();
  });

  test('renders minimal response with insufficient data warning', () => {
    render(<CurriculumRecommendation responses={minimalResponses} clientName="Test User 3" />);
    
    // Should show warning about insufficient data
    expect(screen.getByText(/insufficient data/i)).toBeInTheDocument();
    expect(screen.getByText(/not enough questions were answered/i)).toBeInTheDocument();
  });

  test('calculates correct hours allocation', () => {
    render(<CurriculumRecommendation responses={completeResponses} clientName="Test User 1" />);
    
    // Should show recommended hours in summary
    expect(screen.getByText(/we recommend a 40-hour curriculum/i)).toBeInTheDocument();
  });

  test('shows response rates correctly', () => {
    render(<CurriculumRecommendation responses={partialResponses} clientName="Test User 2" />);
    
    // Should show response rates column
    expect(screen.getByRole('columnheader', { name: /response rate/i })).toBeInTheDocument();
  });
});
