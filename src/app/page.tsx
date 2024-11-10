import SignIn from "./sign-in/page";
import { auth } from "../../auth";
import DashboardWrapper from "@/components/DashboardWrapper";

export default async function Home() {
  
const session = await auth();
console.log(session); 
  return (
    <div>
      {!session? (
      <SignIn />)
      :(
        <div>
      <DashboardWrapper/>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      </div>
      )
} 
    
    </div>
  )
}
