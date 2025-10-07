import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export default function Home() {
  return null; // will never render, user is redirected
}

// Redirect based on session
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    // If logged in, redirect to dashboard
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } else {
    // If not logged in, redirect to login
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
