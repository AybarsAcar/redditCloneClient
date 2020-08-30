import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery, useMeQuery } from "../../generated/graphql";
import Wrapper from "../../components/Wrapper";
import { Heading, Text, Box } from "@chakra-ui/core";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";

const Post = () => {
  const router = useRouter();

  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, error, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });

  // fetch user to selectively render the delete and edit buttons
  const [{ data: meData }] = useMeQuery();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (fetching) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <Heading>{data.post.title}</Heading>
      <Text mt={5}>{data.post.text}</Text>
      <Text mt={5}>writthen by {data.post.creator.username}</Text>
      {meData?.me?.id === data.post.creator.id && (
        <Box mt={4}>
          <EditDeletePostButtons id={data.post.id} />
        </Box>
      )}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
