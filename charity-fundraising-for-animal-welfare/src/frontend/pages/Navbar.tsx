// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { Flex, Text } from "@chakra-ui/react";
import logo from "/public/images/logo.png";

const Navbar: React.FC = () => {
  return ( 
    <Flex justifyContent="space-between" alignItems="center" p={4} bgColor="teal.400" color="black">
      {/* Logo and text together */}
      <Flex alignItems="center">
        <img src={logo.src} alt="Logo" width="70px" height="70px" background-image="true" />
        <Link href="/">
        <Text fontSize="3xl" fontWeight="bold" color="black" ml={5} fontFamily="Monaco" fontStyle="Italic">
          
          AniChain
        </Text>
        </Link>
      </Flex>
      
      {/* Navigation links on the right */}
      <ul style={{ listStyleType: 'none', display: 'flex', gap: '20px' }}>
        <li>
          <Link href="/">
            
              <Text fontSize="lg" fontWeight="bold">Home</Text>
            
          </Link>
        </li>
        <li>
          <Link href="/AboutUs">
            
              <Text fontSize="lg" fontWeight="bold">About Us</Text>
            
          </Link>
        </li>
        <li>
          <Link href="/Donate">
            
              <Text fontSize="lg" fontWeight="bold">Donation</Text>
            
          </Link>
        </li>
       
      </ul>
    </Flex>
  );
};

export default Navbar;
