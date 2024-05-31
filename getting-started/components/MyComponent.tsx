import React, { useEffect, useState } from 'react';
import { Center, Flex, Button, Text, useToast } from "@chakra-ui/react";
import CurrencyCard from './currencycard';

interface Currency {
  name: string;
  symbol: string;
  conversion_to_USD: number;
}

const MyComponent: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("0.0");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<number>(0.0);
  const [inputColorPay, setInputColorPay] = useState<string>("gray");
  const [inputColorReceive, setInputColorReceive] = useState<string>("gray");
  const toast = useToast(); // Initialize toast

  const fetchCurrencies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://frontend-interview-api.fly.dev/currencies", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'burst_interview_01'
        }
      });
      const data: Currency[] = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    const converted = parseFloat(inputValue) * getConversionRate(selectedCurrency);
    setConvertedValue(isNaN(converted) ? 0.0 : roundToTwoDecimalPlaces(converted));

    if (inputValue !== "0.0" && selectedCurrency !== "") {
      setInputColorPay("black");
      setInputColorReceive("black");
    } else {
      setInputColorPay("gray");
      setInputColorReceive("gray");
    }
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    const converted = parseFloat(inputValue) * getConversionRate(currency);
    setConvertedValue(isNaN(converted) ? 0.0 : roundToTwoDecimalPlaces(converted));

    // Update input color based on input value and selected currency
    if (inputValue !== "0.0" && currency !== "") {
      setInputColorPay("black");
      setInputColorReceive("black");
    } else {
      setInputColorPay("gray");
      setInputColorReceive("gray");
    }
  };

  const getConversionRate = (currency: string) => {
    const selected = currencies.find(item => item.symbol === currency);
    return selected ? selected.conversion_to_USD : 0.0;
  };

  const roundToTwoDecimalPlaces = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  const handleConfirmClick = async () => {
    if (!selectedCurrency || !inputValue) return;

    const requestData = {
      source_currency_symbol: selectedCurrency, 
      source_currency_amount: parseFloat(inputValue),
      destination_currency_symbol: 'USD',
      destination_currency_amount: parseFloat(convertedValue.toFixed(2))
    };

    try {
      setIsLoading(true);
      const response = await fetch('https://frontend-interview-api.fly.dev/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'burst_interview_01'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: "Money converted!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log('Request successful');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const isButtonEnabled = selectedCurrency && parseFloat(inputValue) > 0;

  return (
    <Center data-testid="my-component-container" minH="100vh">
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
            inputTestId="pay-input" // Add data-testid attribute
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
            disabled={!isButtonEnabled}
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    </Center>
  );
};

export default MyComponent;
