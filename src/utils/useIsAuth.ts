import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

// custom hook to check authentication
export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  console.log(router);

  useEffect(() => {
    if (!fetching && !data.me) {
      // telling the client where they shoud be directed after login
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
