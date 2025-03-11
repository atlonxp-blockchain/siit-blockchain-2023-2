import React from 'react';
import Link from 'next/link';
import { Flex, Text, Box, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import homephoto from "/public/images/homepage.jpeg";
import backgroundPhoto from "/public/images/background.jpeg";

const MotionBox = motion(Box);

const MotionText = motion(Text);
const MotionButton = motion(Button);

const HomePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" py={8} bg="white" color="black">
      {/* Logo and Navigation */}
     
      
     
      <MotionBox {...fadeInUp} flex="1" mb={{ base: 8, md: 0 }} >
        <Box
            backgroundImage={`url(${backgroundPhoto.src})`}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"  
            width="100vw"
            minHeight="450px"
            position="relative"
            gridTemplateColumns="1fr 1fr"
            border="1px solid black"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="lg"
        >
        
        <Box position="absolute" top="50%" left="50%" borderRadius="xl" transform="translate(-50%, -50%)" textAlign="center" color="Black" fontSize="2xl" fontWeight="bold" bgColor = "Teal"
          >
            🌟 Welcome to AniChain's Animal Welfare Center 🌟 <br />
            Providing love and care for animals in need. <br />
            <br />
            <MotionButton
                as={Link}
                href="/Donate"
                bottom="20px"
                right="20px"
                padding="10px 20px"
                rounded="lg"
                color="white"
                bg="teal.400"
                fontSize="lg"
                fontWeight="bold"
                
                _hover={{ opacity: 0.8 }}
                >
                Donate
            </MotionButton>
        </Box>

   
    
  </Box>
</MotionBox>

      {/* Image and Text Section */}
      <Flex direction={{ base: "column", md: "row" }} align="center" justify="center">
        <MotionBox {...fadeInUp} flex="1" mb={{ base: 8, md: 0 }} mt={20} border="1px solid black" borderRadius="xl" overflow="hidden" boxShadow="lg">
          <img src={homephoto.src} alt="dog" width="100%" height="100%" />
        </MotionBox>

        <MotionBox
          flex="1"
          p={4}
          my={{ base: 8, md: 0 }}
          textAlign="flex-start"
          boxShadow="md"
          bg="teal.400"
          rounded="lg"
        >
          <MotionText fontSize="xl" fontWeight="bold" color="white">
            At AniChain, we believe in the transformative power of compassion, technology, and community. Our journey began in the bustling halls of the digital engineering world, where three visionaries, Dragon, Khang, and Namo, found themselves inspired by a shared passion for making a meaningful impact.
          </MotionText>
        
          <Link href="/AboutUs" passHref>
            <MotionBox
              as={MotionButton}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              color="black" borderColor="white" mt={4}
            >
             Read More
            </MotionBox>
          </Link>
        </MotionBox>
      </Flex>

      {/* Footer */}
      <MotionBox
        mt="auto" py={4}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <MotionText fontSize="sm">
          © 2023 Anichain. All rights reserved.
        </MotionText>
      </MotionBox>
    </Flex>
  );
};

export default HomePage;
