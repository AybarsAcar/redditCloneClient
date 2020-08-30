import { Box, IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
}) => {
  const [results, deletePost] = useDeletePostMutation();

  return (
    <>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} mr={3} icon="edit" aria-label="edit post" />
      </NextLink>
      <IconButton
        onClick={() => {
          deletePost({ id });
        }}
        icon="delete"
        aria-label="delete post"
      />
    </>
  );
};

export default EditDeletePostButtons;
