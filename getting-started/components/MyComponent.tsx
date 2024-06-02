import React, { useEffect, useState } from 'react'; // Import necessary hooks from React
import { Center, Flex, Button, Text, useToast } from "@chakra-ui/react"; // Import components and hooks from Chakra UI
import CurrencyCard from './currencycard'; // Import custom CurrencyCard component

// Define the Currency interface to specify the structure of currency objects
interface Currency {
  name: string; // Name of the currency
  symbol: string; // Symbol of the currency
  conversion_to_USD: number; // Conversion rate to USD
}

const MyComponent: React.FC = () => {
  // Define state variables
  const [currencies, setCurrencies] = useState<Currency[]>([]); // Store list of currencies
  const [isLoading, setIsLoading] = useState<boolean>(false); // Manage loading state
  const [inputValue, setInputValue] = useState<string>("0.0"); // Store the input value from the user
  const [selectedCurrency, setSelectedCurrency] = useState<string>(""); // Store the selected currency symbol
  const [convertedValue, setConvertedValue] = useState<number>(0.0); // Store the converted value in USD
  const [inputColorPay, setInputColorPay] = useState<string>("gray"); // Manage input color for "Pay" field
  const [inputColorReceive, setInputColorReceive] = useState<string>("gray"); // Manage input color for "Receive" field
  const toast = useToast(); // Hook for showing toast notifications

  // Function to fetch currencies from the API
  const fetchCurrencies = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetch("https://frontend-interview-api.fly.dev/currencies", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'burst_interview_01'
        }
      });
      const data: Currency[] = await response.json(); // Parse the response JSON to get the currency data
      setCurrencies(data); // Update the currencies state with the fetched data
    } catch (error) {
      console.error("Error fetching currencies:", error); // Log any errors
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Function to handle input change in the "Pay" field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Get the input value
    setInputValue(inputValue); // Update the inputValue state

    // Calculate the converted value based on the input value and selected currency's conversion rate
    const converted = parseFloat(inputValue) * getConversionRate(selectedCurrency);
    setConvertedValue(isNaN(converted) ? 0.0 : truncateToTwoDecimalPlaces(converted)); // Update the convertedValue state

    // Update input colors based on whether the input value and selected currency are valid
    if (inputValue !== "0.0" && selectedCurrency !== "") {
      setInputColorPay("black");
      setInputColorReceive("black");
    } else {
      setInputColorPay("gray");
      setInputColorReceive("gray");
    }
  };

  // Function to handle currency selection
  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency); // Update the selectedCurrency state
    // Calculate the converted value based on the input value and selected currency's conversion rate
    const converted = parseFloat(inputValue) * getConversionRate(currency);
    setConvertedValue(isNaN(converted) ? 0.0 : truncateToTwoDecimalPlaces(converted)); // Update the convertedValue state

    // Update input colors based on whether the input value and selected currency are valid
    if (inputValue !== "0.0" && currency !== "") {
      setInputColorPay("black");
      setInputColorReceive("black");
    } else {
      setInputColorPay("gray");
      setInputColorReceive("gray");
    }
  };

  // Function to get the conversion rate for a selected currency
  const getConversionRate = (currency: string) => {
    const selected = currencies.find(item => item.symbol === currency); // Find the selected currency in the currencies list
    return selected ? selected.conversion_to_USD : 0.0; // Return the conversion rate if found, otherwise return 0.0
  };

  // Function to truncate a number to two decimal places
  const truncateToTwoDecimalPlaces = (num: number) => {
    return Math.floor(num * 100) / 100; // Truncate the number to two decimal places
  };

  // Function to handle the "Confirm" button click
  const handleConfirmClick = async () => {
    if (!selectedCurrency || !inputValue) return; // Do nothing if no currency is selected or input value is empty

    // Prepare the request data for the API call
    const requestData = {
      source_currency_symbol: selectedCurrency, 
      source_currency_amount: parseFloat(inputValue),
      destination_currency_symbol: 'USD',
      destination_currency_amount: parseFloat(convertedValue.toFixed(2))
    };

    try {
      setIsLoading(true); // Set loading state to true
      const response = await fetch('https://frontend-interview-api.fly.dev/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'burst_interview_01'
        },
        body: JSON.stringify(requestData) // Send the request data as JSON
      });

      if (!response.ok) {
        throw new Error('Network response was not ok'); // Throw an error if the response is not ok
      }

      // Show a success toast notification
      toast({
        title: "Money converted!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log('Request successful'); // Log success message
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error); // Log any errors
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Fetch currencies when the component is mounted
  useEffect(() => {
    fetchCurrencies(); // Call fetchCurrencies to load the initial list of currencies
  }, []);

  // Determine if the "Confirm" button should be enabled
  const isButtonEnabled = selectedCurrency && parseFloat(inputValue) > 0;

  return (
    <Center data-testid="my-component-container" minH="100vh"> {/* Center the content vertically and horizontally */}
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        maxW="full"
        bg="white"
        rounded="xl"
        w={{ base: "full", md: "506px" }}
      >
        <Text fontSize="4xl" fontWeight="semibold" color="gray.800" mb={8}>
          Convert
        </Text>
        <Flex flexDir="column" p={3} maxW="full">
          <CurrencyCard
            label="Pay"
            value={0.0}
            buttonText="Select Currency"
            isPay
            maxW="400px"
            inputValue={inputValue} 
            onInputChange={handleInputChange} 
            convertedValue={convertedValue} 
            selectedCurrency={selectedCurrency} 
            handleCurrencySelect={handleCurrencySelect} 
            isLoading={isLoading} 
            currencies={currencies} 
            inputColor={inputColorPay} 
            setInputColor={setInputColorPay} 
            isButtonDisabled={false} 
            inputTestId="pay-input" 
          />
          <CurrencyCard
            label="Receive"
            value={convertedValue} 
            buttonText="USD"
            isPay={false}
            maxW="400px"
            inputValue={convertedValue.toFixed(2)} 
            onInputChange={() => { }} 
            convertedValue={convertedValue} 
            selectedCurrency="USD" 
            handleCurrencySelect={() => { }} 
            isLoading={isLoading} 
            currencies={currencies} 
            inputColor={inputColorReceive} 
            setInputColor={setInputColorReceive} 
            isButtonDisabled={true} 
            inputTestId="receive-input" 
          />
          <Button
            mt={12}
            ml={{ base: 0, md: 5 }}
            px={16}
            py={4}
            fontSize="lg"
            fontWeight="semibold"
            rounded="xl"
            colorScheme="blue"
            bg={isButtonEnabled ? "blue.500" : "gray.300"}
            maxW="full"
            _hover={isButtonEnabled ? { bg: "blue.600" } : {}} 
            _disabled={{ bg: "gray.300", cursor: "not-allowed" }} 
            onClick={handleConfirmClick} 
            disabled={!isButtonEnabled} // Disable the button if conditions are not met
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    </Center>
  );
};

export default MyComponent;
