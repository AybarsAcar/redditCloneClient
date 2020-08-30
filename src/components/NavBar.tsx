import { Box, Link, Flex, Button } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/router";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();

  // fetch if the users logged in
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  console.log(data);

  let body = null;

  // data is loading
  if (fetching) {
  }
  // user is not logged in
  else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={4}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  }
  // user is logged in
  else {
    body = (
      <Box>
        {data.me.username}
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          variant="link"
          ml={6}
          color="white"
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Flex p={4} bg="tan">
      <NextLink href="/">
        <Link color="white" mr={4}>
          Home
        </Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(Navbar);
