import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import MyComponent from '../components/MyComponent'; // Assuming you have a Layout component for consistency

const IndexPage: React.FC = () => {
  return (
    <ChakraProvider>
        <div style={{ background: "#f0f4f8", minHeight: "100vh" }}>
          <MyComponent />
        </div>
    </ChakraProvider>
  );
};

export default IndexPage;