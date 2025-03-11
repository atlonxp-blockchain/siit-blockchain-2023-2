import React from 'react';
import { Flex, Text, Box, Wrap, WrapItem, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import cat from "/public/images/cat.png";

const AboutUs: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <Flex justifyContent="center" alignItems="center" p="4">
        <Heading fontSize="3xl" fontWeight="bold" color="teal.500">
          Meet the Visionaries
        </Heading>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Box border="1px solid black" borderRadius="xl" overflow="hidden" boxShadow="lg">
            <img src={cat.src} alt="Logo" width="400px" height="500px" background-image="true" />
          </Box>
        </motion.div>
      </Flex>

      <Flex direction="row">
        <Box px="4">
          <Wrap spacing="4" justify="center">
            <WrapItem style={{ flex: "1" }}>
              <Box
                mt={12}
                width="100%"
                borderRadius="xl"
                border="2px solid"
                borderColor="teal.500"
                overflow="hidden"
                boxShadow="lg"
              >
                <Box boxShadow="lg" p="4" bg="white" borderRadius="md">
                  <Heading mb={4} fontSize="3xl" fontWeight="bold" color="teal.500" align="center">
                    🔥 Dragon
                  </Heading>
                  <Text mt={5}>
                    Igniting Change
                    Driven by an unyielding commitment to bettering the world, Dragon is the heart and soul of our initiative. With a fiery spirit, Dragon leads the charge in ensuring no animal is left behind.
                  </Text>
                </Box>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>

        <Box px="4">
          <Wrap spacing="4" justify="center">
            <WrapItem style={{ flex: "1" }}>
              <Box
                mt={12}
                width="100%"
                borderRadius="xl"
                border="2px solid"
                borderColor="teal.500"
                overflow="hidden"
                boxShadow="lg"
              >
                <Box boxShadow="lg" p="4" bg="white" borderRadius="md">
                  <Heading mb={4} fontSize="3xl" fontWeight="bold" color="teal.500" align="center">
                    💡 Khang
                  </Heading>
                  <Text mt={5}>
                    - Engineering Hope
                    A maestro in the digital realm, Khang envisions a world where technology converges with compassion. His engineering prowess is the backbone of our efforts, creating a seamless bridge between our cause and the community.
                  </Text>
                </Box>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>

        <Box px="4">
          <Wrap spacing="4" justify="center">
            <WrapItem style={{ flex: "1" }}>
              <Box
                mt={12}
                width="100%"
                borderRadius="xl"
                border="2px solid"
                borderColor="teal.500"
                overflow="hidden"
                boxShadow="lg"
              >
                <Box boxShadow="lg" p="4" bg="white" borderRadius="md">
                  <Heading mb={4} fontSize="3xl" fontWeight="bold" color="teal.500" align="center">
                    🌈 Namo
                  </Heading>
                  <Text mt={5}>
                    The Compassionate Navigator
                    Namo, with a heart as vast as the ocean, guides us with empathy and wisdom. His dedication to creating a haven for animals in need propels our mission forward, steering us towards a brighter future.
                  </Text>
                </Box>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
      </Flex>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Box px="4">
          <Wrap spacing="4" justify="center">
            <WrapItem>
              <Box
                mt={12}
                width="100%"
                borderRadius="xl"
                border="2px solid"
                borderColor="teal.500"
                overflow="hidden"
                boxShadow="lg"
              >
                <Box boxShadow="lg" p="4" bg="white" borderRadius="md">
                  <Text mt={5}>
                    The Blockchain Epiphany:
                    Our groundbreaking idea sprouted during a riveting blockchain class led by the exceptional Professor Watthanasak Jeamwatthanachai. Under his guidance, the seeds of AniChain were planted, intertwining our digital expertise with a deep sense of responsibility towards our furry friends.
                  </Text>
                </Box>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
      </motion.div>

      <Flex direction="column" align="center" justify="center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Box mt="auto" py={4} alignItems="center">
            <Text fontSize="sm">
              © 2023 Anichain. All rights reserved.
            </Text>
          </Box>
        </motion.div>
      </Flex>
    </>
  );
};

export default AboutUs;
