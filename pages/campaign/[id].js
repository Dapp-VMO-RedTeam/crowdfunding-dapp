import Head from "next/head";
import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import {
  getETHPrice,
  getETHPriceInUSD,
  getWEIPriceInUSD,
} from "../../lib/convert";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  InputRightAddon,
  InputGroup,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  CloseButton,
  FormHelperText,
  Link,
  Table, Thead, Tr, Tbody, Th, Td
} from "@chakra-ui/react";

import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Confetti from "react-confetti";

import web3 from "../../service/web3";
import Campaign from "../../service/campaign";
import factory from "../../service/factory";
import campaign from "../../service/campaign";

export async function getServerSideProps({ params }) {
  const campaignId = params.id;
  const campaign = Campaign(campaignId);
  const summary = await campaign.methods.getSummary().call();
  const ETHPrice = await getETHPrice();


  return {
    props: {
      id: campaignId,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      name: summary[5],
      description: summary[6],
      image: summary[7],
      contributorsCount: summary[8],
      target: summary[9],
      ETHPrice,
    },
  };
}

const ContributorRow = ({
  id,
  contributor,
  ETHPrice,
}) => {
  return (
    <Tr>
      <Td>{id} </Td>
      <Td>
        <Link
          color="blue.500"
          href={`https://rinkeby.etherscan.io/address/${contributor.contributorAddress}`}
          isExternal
        >
          {" "}
          {contributor.contributorAddress.substr(0, 10) + "..."}
        </Link>
      </Td>
      <Td isNumeric>
        {web3.utils.fromWei(contributor.value, "ether")}ETH ($
        {getWEIPriceInUSD(ETHPrice, contributor.value)})
      </Td>
      {/* <Td>
      <Link
          color="blue.500"
          href={`https://rinkeby.etherscan.io/address/${contributor.transactionHash}`}
          isExternal
        >
          {" "}
          {contributor.transactionHash.substr(0, 10) + "..."}
        </Link>
      </Td> */}

    </Tr>
  );
};

function StatsCard(props) {
  const { title, stat, info } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"sm"}
      border={"1px solid"}
      borderColor={"gray.500"}
      rounded={"lg"}
      transition={"transform 0.3s ease"}
      _hover={{
        transform: "translateY(-5px)",
      }}
    >
      <Tooltip
        label={info}
        bg={useColorModeValue("white", "gray.700")}
        placement={"top"}
        color={useColorModeValue("gray.800", "white")}
        fontSize={"1em"}
      >
        <Flex justifyContent={"space-between"}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={"medium"} isTruncated>
              {title}
            </StatLabel>
            <StatNumber
              fontSize={"base"}
              fontWeight={"bold"}
              isTruncated
              maxW={{ base: "	10rem", sm: "sm" }}
            >
              {stat}
            </StatNumber>
          </Box>
        </Flex>
      </Tooltip>
    </Stat>
  );
}

export default function CampaignSingle({
  id,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
  name,
  description,
  image,
  contributorsCount,
  target,
  ETHPrice,
}) {
  const { handleSubmit, register, formState, reset, getValues } = useForm({
    mode: "onChange",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [amountInUSD, setAmountInUSD] = useState();
  const [contributorsList, setContributorsList] = useState([]);
  const wallet = useWallet();
  const router = useRouter();
  const { width, height } = useWindowSize();
  const campaign = Campaign(id);

  async function onSubmit(data) {
    console.log(data);
    try {
      const campaign = Campaign(id);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(data.value, "ether"),
      });
      
      router.push(`/campaign/${id}`);
      setAmountInUSD(null);
      reset("", {
        keepValues: false,
      });
      setIsSubmitted(true);
      setError(false);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  async function getContributors() {
    try {
      console.log("contributors ", contributorsCount);
      const contributors = await Promise.all(
        Array(parseInt(contributorsCount))
          .fill()
          .map((contr, index) => {
            return campaign.methods.contributors(index).call();
          })
      );

      setContributorsList(contributors);
      return contributors;
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getContributors();
  }, []);

  return (
    <div>
      <Head>
        <title>Chi???n d???ch </title>
        <meta name="description" content="C??c y??u c???u r??t qu???" />
        <link rel="icon" href="/icons8-kite-50.png" />
      </Head>
      {isSubmitted ? <Confetti width={width} height={height} /> : null}
      <main>
        {" "}
        <Box position={"relative"}>
          {isSubmitted ? (
            <Container
              maxW={"7xl"}
              columns={{ base: 1, md: 2 }}
              spacing={{ base: 10, lg: 32 }}
              py={{ base: 6 }}
            >
              <Alert status="success" mt="2">
                <AlertIcon />
                <AlertDescription mr={2}>
                  {" "}
                  C???m ??n v?? s??? h??? tr??? c???a b???n r???t nhi???u !
                </AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setIsSubmitted(false)}
                />
              </Alert>
            </Container>
          ) : null}
          <Container
            as={SimpleGrid}
            maxW={"7xl"}
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 10, lg: 32 }}
            py={{ base: 6 }}
          >
            <Stack spacing={{ base: 6 }}>
              <Heading
                lineHeight={1.1}
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              >
                {name}
              </Heading>
              <Text
                color={useColorModeValue("gray.500", "gray.200")}
                fontSize={{ base: "lg" }}
              >
                {description}
              </Text>
              <Link
                color="blue.500"
                href={`https://rinkeby.etherscan.io/address/${id}`}
                isExternal
              >
                Xem tr??n Rinkeby Etherscan <ExternalLinkIcon mx="2px" />
              </Link>
              <Box mx={"auto"} w={"full"}>
                <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5 }}>
                  <StatsCard
                    title={"M???c t???i thi???u"}
                    stat={`${web3.utils.fromWei(
                      minimumContribution,
                      "ether"
                    )} ETH ($${getWEIPriceInUSD(
                      ETHPrice,
                      minimumContribution
                    )})`}
                    info={
                      "L?????ng t???i thi???u Wei ( 1 ETH = 10 ^ 18 Wei) c???n ????? tr??? th??nh ng?????i tham gia qu??? "
                    }
                  />
                  <StatsCard
                    title={"?????a ch??? v?? c???a ng?????i/t??? ch???c t???o chi???n d???ch"}
                    stat={manager}
                    info={
                      "Ng?????i/T??? ch???c t???o chi???n d???ch c?? th??? y??u c???u r??t ti???n "
                    }
                  />
                  <StatsCard
                    title={"S??? l?????ng y??u c???u "}
                    stat={requestsCount}
                    info={
                      "Y??u c???u r??t qu??? c???n ???????c th??ng qua v???i h??n 50% bi???u quy???t ?????ng ?? "
                    }
                  />
                  <StatsCard
                    title={"S??? l?????ng ng?????i bi???u quy???t "}
                    stat={approversCount}
                    info={
                      "S??? l?????ng ng?????i ???? tham gia g??y qu??? cho chi???n d???ch n??y "
                    }
                  />
                </SimpleGrid>
              </Box>
            </Stack>
            <Stack spacing={{ base: 4 }}>
              <Box>
                <Stat
                  bg={useColorModeValue("white", "blue.700")}
                  boxShadow={"lg"}
                  rounded={"xl"}
                  p={{ base: 4, sm: 6, md: 8 }}
                  spacing={{ base: 8 }}
                >
                  <StatLabel fontWeight={"medium"}>
                    <Text as="span" isTruncated mr={2}>
                      {" "}
                      T???ng qu???
                    </Text>
                    <Tooltip
                      label="S??? l?????ng qu??? c??n l???i "
                      bg={useColorModeValue("white", "blue.700")}
                      placement={"top"}
                      color={useColorModeValue("blue.800", "white")}
                      fontSize={"1em"}
                      px="4"
                    >
                      <InfoIcon
                        color={useColorModeValue("blue.800", "white")}
                      />
                    </Tooltip>
                  </StatLabel>
                  <StatNumber>
                    <Box
                      fontSize={"2xl"}
                      isTruncated
                      maxW={{ base: "	15rem", sm: "sm" }}
                      pt="2"
                    >
                      <Text as="span" fontWeight={"bold"}>
                        {balance > 0
                          ? web3.utils.fromWei(balance, "ether")
                          : "0, H??? tr??? chi???n d???ch"}
                      </Text>
                      <Text
                        as="span"
                        display={balance > 0 ? "inline" : "none"}
                        pr={2}
                        fontWeight={"bold"}
                      >
                        {" "}
                        ETH
                      </Text>
                      <Text
                        as="span"
                        fontSize="lg"
                        display={balance > 0 ? "inline" : "none"}
                        fontWeight={"normal"}
                        color={useColorModeValue("gray.500", "gray.200")}
                      >
                        (${getWEIPriceInUSD(ETHPrice, balance)})
                      </Text>
                    </Box>

                    <Text fontSize={"md"} fontWeight="normal">
                      / {web3.utils.fromWei(target, "ether")} ETH ($
                      {getWEIPriceInUSD(ETHPrice, target)})
                    </Text>
                    <Progress
                      colorScheme="blue"
                      size="sm"
                      value={web3.utils.fromWei(balance, "ether")}
                      max={web3.utils.fromWei(target, "ether")}
                      mt={4}
                    />
                  </StatNumber>
                </Stat>
              </Box>
              <Stack
                bg={useColorModeValue("white", "blue.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={{ base: 6 }}
              >
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  color={useColorModeValue("blue.600", "blue.200")}
                >
                  ????ng g??p v?? c???ng ?????ng !
                </Heading>

                <Box mt={10}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl id="value">
                      <FormLabel>
                        S??? l?????ng ETH b???n mu???n ????ng g??p
                      </FormLabel>
                      <InputGroup>
                        {" "}
                        <Input
                          {...register("value", { required: true })}
                          type="number"
                          isDisabled={formState.isSubmitting}
                          onChange={(e) => {
                            setAmountInUSD(Math.abs(e.target.value));
                          }}
                          step="any"
                          min="0"
                        />{" "}
                        <InputRightAddon children="ETH" />
                      </InputGroup>
                      {amountInUSD ? (
                        <FormHelperText>
                          ~$ {getETHPriceInUSD(ETHPrice, amountInUSD)}
                        </FormHelperText>
                      ) : null}
                    </FormControl>

                    {error ? (
                      <Alert status="error" mt="2">
                        <AlertIcon />
                        <AlertDescription mr={2}> {error}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Stack spacing={10}>
                      {wallet.status === "connected" ? (
                        <Button
                          fontFamily={"heading"}
                          mt={4}
                          w={"full"}
                          bgGradient="linear(to-r, teal.400,green.400)"
                          color={"white"}
                          _hover={{
                            bgGradient: "linear(to-r, teal.400,blue.400)",
                            boxShadow: "xl",
                          }}
                          isLoading={formState.isSubmitting}
                          isDisabled={amountInUSD ? false : true}
                          type="submit"
                        >
                          ????ng g??p
                        </Button>
                      ) : (
                        <Alert status="warning" mt={4}>
                          <AlertIcon />
                          <AlertDescription mr={2}>
                            H??y li??n k???t v???i v?? c???a b???n
                          </AlertDescription>
                        </Alert>
                      )}
                    </Stack>
                  </form>
                </Box>
              </Stack>

              <Stack
                bg={useColorModeValue("white", "blue.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={4}
              >
                <NextLink href={`/campaign/${id}/requests`}>
                  <Button
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, teal.400,green.400)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, teal.400,blue.400)",
                      boxShadow: "xl",
                    }}
                  >
                    Xem c??c y??u c???u r??t qu???
                  </Button>
                </NextLink>
                <Text fontSize={"sm"}>
                  * B??y gi??? b???n c?? th??? xem c??c y??u c???u r??t qu??? c???a ng?????i/t??? ch???c chi???n d???ch v?? c?? quy???n bi???u quy???t ch???p nh???n y??u c???u
                </Text>
              </Stack>
              <Stack
                bg={useColorModeValue("white", "blue.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={4}
              >
                <Text fontSize={"lf"}>
                  * L???ch s??? ????ng g??p 
                </Text>
                <Box overflowX="auto">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>STT</Th>
                        <Th w="45%">?????a ch??? v?? </Th>
                        <Th isNumeric>S??? l?????ng </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {contributorsList.map((contributor, index) => {
                        return (
                          <ContributorRow
                            key={index}
                            id={index + 1}
                            contributor={contributor}
                            ETHPrice={ETHPrice}
                          />
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </Stack>

            </Stack>
          </Container>
        </Box>
      </main>
    </div>
  );
}
