import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  usePostsQuery,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/core";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";

const Index = () => {
  //paginate
  const [values, setValues] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data, error, fetching }] = usePostsQuery({
    variables: values,
  });

  // fetch user to selectively render the delete and edit buttons
  const [{ data: meData }] = useMeQuery();

  if (!fetching && !data) {
    return (
      <div>
        Query Failed
        <p>{error.message}</p>
      </div>
    );
  }

  const loadMore = () => {
    setValues({
      limit: values.limit,
      cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
    });
  };

  return (
    <>
      <Wrapper>
        <Flex>
          <Heading>LeReddit</Heading>
          <NextLink href="/create-post">
            <Link ml="auto">Create a Post</Link>
          </NextLink>
        </Flex>
        <br />
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box ml={5} style={{ width: "100%" }}>
                    <Flex>
                      <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text ml="auto">posted by: {p.creator.username}</Text>
                    </Flex>
                    <Text mt={4}>{p.textSnippet} ...</Text>
                    <Flex mt={3}>
                      <Text mt={4}>{p.createdAt}</Text>
                      {meData?.me?.id === p.creator.id && (
                        <Box ml="auto">
                          <EditDeletePostButtons id={p.id} />
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}

        <Box>
          {data && data.posts.hasMore && (
            <Button onClick={loadMore} isLoading={fetching} mb={8} mt={8}>
              Load more...
            </Button>
          )}
        </Box>
      </Wrapper>
    </>
  );
};

// set ssr to true to render on the server
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
