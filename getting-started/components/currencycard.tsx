import React, { useState } from 'react';
import { Box, Flex, Button, Text, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";

// Define the structure of the Currency object
interface Currency {
  name: string;
  symbol: string;
  conversion_to_USD: number;
}

// Define the properties expected by the CurrencyCard component
interface CurrencyCardProps {
  label: string;
  value: number;
  buttonText: string;
  isPay: boolean;
  maxW: string;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  convertedValue: number;
  selectedCurrency: string;
  handleCurrencySelect: (currency: string) => void;
  isLoading: boolean;
  currencies: Currency[];
  inputColor: string;
  setInputColor: React.Dispatch<React.SetStateAction<string>>;
  isButtonDisabled: boolean;
  inputTestId: string;
}

// Define the CurrencyCard component
const CurrencyCard: React.FC<CurrencyCardProps> = ({
  label,
  value,
  buttonText,
  isPay,
  maxW,
  inputValue,
  onInputChange,
  convertedValue,
  selectedCurrency,
  handleCurrencySelect,
  isLoading,
  currencies,
  inputColor,
  setInputColor,
  isButtonDisabled,
  inputTestId
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility

  return (
    <Box
      p={{ base: 5, md: 7 }}
      rounded="xl"
      borderWidth="1px"
      borderColor={isPay ? "blue.500" : "gray.200"}
      maxW={maxW}
      w="400px" // Fixed width
      h="150px" // Fixed height
    >
      <Text fontSize="md" fontWeight="medium" color="gray.600" mb={3} maxW="full">
        {label}
      </Text>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Text fontSize="2xl" fontWeight="semibold" color="gray.400">
          <Input
            type="number"
            value={inputValue}
            onChange={onInputChange}
            onFocus={() => setInputColor("black")}
            onBlur={() => setInputColor(inputValue === "0.0" ? "gray" : "black")}
            min="0"
            step="0.01"
            w="120px"
            fontSize="lg"
            border="none"
            bg="transparent"
            _focus={{ boxShadow: "none" }}
            color={inputColor}
            data-testid={inputTestId}
          />
        </Text>
        <Button
          as={Button}
          px={5}
          py={3}
          fontSize="sm"
          fontWeight="medium"
          rounded="xl"
          colorScheme={isPay ? "blue" : "gray"}
          alignItems="center"
          gap={2}
          leftIcon={isPay && <Image src="https://cdn.builder.io/api/v1/image/assets/TEMP/69405752b7cf38fa9ead3db9ee6c4b3c0f8d42d27aac30addc26a7113b6bad69?apiKey=92a52773df144ea181bd940464e47be8&" alt="" w={3} />}
          isLoading={isLoading}
          onClick={isButtonDisabled ? () => {} : () => setIsOpen(true)} // Open modal unless button is disabled
          disabled={isButtonDisabled} // Disable the button if necessary
        >
          {selectedCurrency || buttonText}
        </Button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}> {/* Modal for currency selection */}
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">Select Asset</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box maxHeight="400px" overflowY="auto">
                {currencies.map((currency, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => {
                      handleCurrencySelect(currency.symbol);
                      setIsOpen(false);
                    }}
                    width="100%"
                    textAlign="left"
                  >
                    <Flex flexDirection="column" alignItems="center">
                      <Text fontSize="md" fontWeight="semibold" marginBottom="1">{currency.name}</Text>
                      <Text fontSize="sm" color="gray.500">{currency.symbol}</Text>
                    </Flex>
                  </Button>
                ))}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
};

export default CurrencyCard;
