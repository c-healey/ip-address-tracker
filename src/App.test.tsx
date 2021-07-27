import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders IP Address', async() => {
  render(<App />);
 
  await expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  // await waitFor(() => expect(screen.getByText(/IP ADDRESS TRACKER/i)).toBeInTheDocument());
});
