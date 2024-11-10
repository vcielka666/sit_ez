import SignIn from "./sign-in/page";
import { auth } from "../../auth";
import DashboardWrapper from "@/components/DashboardWrapper";

export default async function Home() {
  
const session = await auth();
  
  return (
    <div>
      {!session?
      <SignIn />
      :
      <DashboardWrapper />
    }
    </div>
  )
}
