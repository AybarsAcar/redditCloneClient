import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useRouter } from "next/router";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import Wrapper from "../../../components/Wrapper";
import { Heading, Text, Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import createPost from "../../create-post";
import InputField from "../../../components/InputField";

const EditPost = () => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });

  const [result, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return <Wrapper>Loading...</Wrapper>;
  }

  if (!data?.post) {
    return <Wrapper>No post</Wrapper>;
  }

  return (
    <Wrapper variant="small">
      <Heading mb={4}>Update Post</Heading>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: postId, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="Text..."
                label="Body"
              />
            </Box>
            <Button
              type="submit"
              variantColor="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
