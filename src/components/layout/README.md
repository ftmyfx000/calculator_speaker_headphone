# Layout Components

This directory contains the layout components for the speaker calculator web application.

## Components

### NavigationMenu
- Displays a list of all available calculators
- Highlights the currently active calculator using React Router's `useLocation` hook
- Provides navigation links to switch between calculators

### Layout
- Implements a responsive layout with a navigation sidebar and main content area
- Uses Tailwind CSS for responsive design (mobile-first approach)
- On mobile: Navigation appears above content
- On desktop (lg breakpoint): Navigation appears as a sidebar

## State Persistence

The application uses React Context (`CalculatorStateContext`) to preserve calculator state across navigation. When you navigate away from a calculator and return to it, all previously entered values are preserved.

### How it works:
1. `CalculatorStateProvider` wraps the entire application in `App.tsx`
2. Each calculator component uses the `useCalculatorState` hook to access and update its state
3. State is stored in the context and persists across route changes
4. Each calculator has its own independent state that doesn't interfere with others

## Testing

Property-based tests verify that state persistence works correctly across all calculators. See `src/contexts/CalculatorStateContext.test.tsx` for the test implementation.
