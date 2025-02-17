// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    h3: 'h3',
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));
