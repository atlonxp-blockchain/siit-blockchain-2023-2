import React, { useState } from "react";
import { Box, Button, Container, Flex, Heading, Input, Text, Card, CardBody, Stack, Skeleton} from "@chakra-ui/react";
import { ethers } from "ethers";
import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead} from "@thirdweb-dev/react";
import pig from "/public/images/mrpig.jpg";

const Donation: React.FC = () => {
  const address = useAddress();

  const contractAddress = "0x3DE58637041bF0f7b1fC8627e8E5A95b4fa396B3";
  const { contract } = useContract(contractAddress);

  const {
    data: totalDonations,
    isLoading: loadingTotalFund,
  } = useContractRead(contract, "getTotalDonations");

  const {
    data: donationAmount,
    isLoading: loadcurrentFund,
  } = useContractRead(contract, "getAllDonations");

  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [donationFrequency, setDonationFrequency] = useState<"one-time" | "monthly">(
    "one-time"
  );
  const [donateamount, setDonationAmount] = useState<number | string>(0.001);
  const handleDonationFrequencyChange = (frequency: "one-time" | "monthly") => {
    setDonationFrequency(frequency);
  };
  const [connectionError, setConnectionError] = useState<boolean>(false);

  const handleDonationAmountChange = (amount: number) => {
    setDonationAmount(amount);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  function clearValues() {
    setMessage("");
    setName("");
  }

  return (
    <Container maxW={"1200px"} w={"full"} style={{ backgroundColor: "white" }}>
      <ConnectWallet onError={() => setConnectionError(true)} />
      <Box
            mt={12}
            width="100%"
            borderRadius="xl"
            border="2px solid"
            borderColor="teal.500"
            overflow="hidden"
            boxShadow="md"
          >
            <Card p={6} bg="white" overflowY="auto" maxHeight="300px">
              <CardBody>
              <Flex direction="row" align="center">
                    <Text fontSize="xl" fontWeight="bold" color="gray.700" mr={2}>
                      Total Donations:
                    </Text>
                    <Skeleton isLoaded={!loadingTotalFund} width={"60px"}>
                      <Text fontSize="xl" fontWeight="semibold" color="teal.500">
                        {totalDonations?.toString()}
                      </Text>
                    </Skeleton>
                  </Flex>
                <Text fontWeight="bold" fontSize="2xl" color="teal.500">
                  Recent Donation:
                </Text>
                {!loadcurrentFund ? (
                  <Box mt={4}>
                    {donationAmount &&
                      donationAmount.map((fund: any, index: number) => {
                        return (
                          <Card key={index} my={2}>
                            <CardBody>
                              <Text fontSize="2xl">{fund[1]}</Text>
                              <Text>From: {fund[2]}</Text>
                            </CardBody>
                          </Card>
                        );
                      }).reverse()}
                  </Box>
                ) : (
                  <Stack>
                    
                  </Stack>
                )}
              </CardBody>
            </Card>
          </Box>

      <Flex direction="column" align="center" justify="center" minH="100vh" py={8}>
        <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" mt={10}>
          {/* Left column for the image */}
          <Box border="1px solid black" borderRadius="xl" overflow="hidden" boxShadow="lg">
            <img src={pig.src} alt="pig" width="700px" height="auto" />
          </Box>

          {/* Right column for the donation box */}
          <Box
            mt={12}
            width="100%"
            borderRadius="xl"
            border="2px solid"
            borderColor="teal.500"
            overflow="hidden"
            boxShadow="lg"
          >
            <Card p={6} bg="white">
              <CardBody>
                <Heading mb={4} fontSize="3xl" fontWeight="bold" color="teal.500">
                  Donate to Animal Welfare
                </Heading>

                <Flex direction="column" mt={4}>
                  <Text fontSize="xl" color="gray.700">
                    Name:
                  </Text>
                  <Input
                    placeholder="Enter your name"
                    maxLength={16}
                    value={name}
                    onChange={handleNameChange}
                    mt={2}
                  />
                </Flex>

                <Flex direction="column" mt={4}>
                  <Text fontSize="xl" color="gray.700">
                    Message:
                  </Text>
                  <Input
                    placeholder="Enter any message"
                    maxLength={80}
                    value={message}
                    onChange={handleMessageChange}
                    mt={2}
                  />
                </Flex>

                <Flex direction="column" mt={6}>
                  {/* Donation frequency buttons */}
                  <Text fontSize="xl" color="gray.700">
                    Select your payment:
                  </Text>
                  <Flex direction="row" mt={2}>
                    <Button
                      onClick={() => handleDonationFrequencyChange("one-time")}
                      fontSize="xl"
                      fontWeight="bold"
                      colorScheme={donationFrequency === "one-time" ? "teal" : "gray"}
                      mr={3}
                    >
                      One-Time
                    </Button>
                    <Button
                      onClick={() => handleDonationFrequencyChange("monthly")}
                      fontSize="xl"
                      fontWeight="bold"
                      colorScheme={donationFrequency === "monthly" ? "teal" : "gray"}
                    >
                      Monthly
                    </Button>
                  </Flex>

                  {/* Donation amount buttons */}
                  <Flex direction="row" mt={3}>
                    <Button
                      onClick={() => handleDonationAmountChange(0.001)}
                      fontSize="xl"
                      fontWeight="bold"
                      colorScheme={donationAmount === 0.001 ? "teal" : "gray"}
                      mr={3}
                    >
                      Ξ0.001
                    </Button>

                    <Button
                      onClick={() => handleDonationAmountChange(0.010)}
                      fontSize="xl"
                      fontWeight="bold"
                      colorScheme={donationAmount === 0.010 ? "teal" : "gray"}
                      mr={3}
                    >
                      Ξ0.010
                    </Button>
                    <Button
                      onClick={() => handleDonationAmountChange(0.100)}
                      fontSize="xl"
                      fontWeight="bold"
                      colorScheme={donationAmount === 0.100 ? "teal" : "gray"}
                      mr={3}
                    >
                      Ξ0.100
                    </Button>
                    <Button
                      onClick={() => handleDonationAmountChange(1.0)}
                      fontSize="xl"
                      fontWeight="bold"
                      colorScheme={donationAmount === 1.0 ? "teal" : "gray"}
                      mr={3}
                    >
                      Ξ1.0
                    </Button>
                  </Flex>

                  {/* Custom donation amount */}
                  <Flex direction="column" mt={3}>
                    <Text fontSize="xl" color="gray.700">
                      Custom Amount:
                    </Text>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={donateamount}
                      onChange={(e) => handleDonationAmountChange(parseFloat(e.target.value))}
                      mt={2}
                    />
                  </Flex>

                  {address ? (
                    <>
                      <Web3Button
                        contractAddress={contractAddress}
                        action={async (contract) => {
                          try {
                            const amountInWei = ethers.utils.parseEther(donateamount.toString());
                            const methodName =
                              donationFrequency === "monthly"
                                ? "donateMonthlyToAnimalWelfare"
                                : "donateToAnimalWelfare";

                            await contract.call(methodName, [message, name], { value: amountInWei });
                            // Clear values on success
                            clearValues();
                          } catch (error) {
                            console.error("Error during donation:", error);
                            // Handle error
                            setConnectionError(true); // Set connection error state
                          }
                        }}
                      >
                        {`Donate ${
                          donationFrequency === "monthly" ? "Monthly" : "One-Time"
                        } Ξ${donateamount}`}
                      </Web3Button>
                      {connectionError && (
                        <Text fontSize="xl" color="red.500">
                          Please connect your wallet before making a donation.
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text fontSize="xl" color="gray.700">
                      Please connect your wallet before a donation
                    </Text>
                  )}
                 
                </Flex>
              </CardBody>
            </Card>
          </Box>

          {/* Recent Donation Box */}
          
        </Flex>
        
        <Flex direction="column" align="center" justify="center">
          <Box mt="auto" py={4} alignItems="center">
            <Text fontSize="sm">© 2023 Anichain. All rights reserved.</Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Donation;
