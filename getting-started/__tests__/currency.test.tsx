import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('updates Receive field when input and currency are selected in Pay field', async () => {
    render(<MyComponent />);
    
    // Find the input element associated with the label "Pay"
    const payInput = screen.getByTestId('pay-input');

    // Simulate user input by changing the value
    fireEvent.change(payInput, { target: { value: '543.98' } });
    expect(payInput).toHaveValue(543.98); // Assuming the conversion results in 120.0
    
    await waitFor(() => {
        // Now check if the value attribute of the "Receive" field is updated
        const receiveInput = screen.getByTestId('receive-input');
        expect(receiveInput).toHaveValue('669.97'); // Assuming the conversion results in 120.0
      });
  });
  });