import SignIn from "~/components/pages/signIn";
import SignUp from "~/components/pages/signUp";
import { TabsHelper } from "~/components/shadcn/tabs";

export default function Page() {
  return (
    <TabsHelper
      tabs={[
        {
          title: "Sign In",
          value: "signin",
          content: <SignIn />,
        },
        {
          title: "Sign Up",
          value: "signup",
          content: <SignUp />,
        },
      ]}
    />
  );
}
