import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders all content', () => {
    render(<MyComponent />);
 
    // Check if the container of MyComponent is rendered
    const container = screen.getByTestId('my-component-container');
    expect(container).toBeInTheDocument();
 
    // Check if the main text is rendered
    const mainText = screen.getByText('Convert');
    expect(mainText).toBeInTheDocument();

    // Check if the Pay CurrencyCard is rendered
    const payCurrencyCard = screen.getByText('Pay');
    expect(payCurrencyCard).toBeInTheDocument();

    // Check if the Receive CurrencyCard is rendered
    const receiveCurrencyCard = screen.getByText('Receive');
    expect(receiveCurrencyCard).toBeInTheDocument();

    // Check if the Confirm Button is rendered
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toBeInTheDocument();
    
    const currencyButton = screen.getByText('Select Currency');
    expect(currencyButton).toBeInTheDocument();
    
  });
});
