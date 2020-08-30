import { Flex, IconButton } from "@chakra-ui/core";
import {
  PostsQuery,
  Post,
  PostSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";
import { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface UpdootSectionProps {
  // this is from the generated posts query
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, vote] = useVoteMutation();

  return (
    <Flex direction="column" alignItems="center" justifyContent="space-between">
      <IconButton
        variantColor={post.voteStatus === 1 ? "green" : undefined}
        onClick={async () => {
          setLoading(true);
          // if already voted
          if (post.voteStatus === 1) {
            setLoading(false);
            return;
          }
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoading(false);
        }}
        icon="chevron-up"
        aria-label="updoot"
        isLoading={loading}
      />
      {post.points}
      <IconButton
        variantColor={post.voteStatus === -1 ? "red" : undefined}
        onClick={async () => {
          setLoading(true);
          // if already voted
          if (post.voteStatus === -1) {
            setLoading(false);
            return;
          }
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoading(false);
        }}
        icon="chevron-down"
        aria-label="downdoot"
        isLoading={loading}
      />
    </Flex>
  );
};

export default UpdootSection;
