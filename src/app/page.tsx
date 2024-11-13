import SignIn from "./sign-in/page";
import { auth } from "../../auth";
import Page from "./adminDashboard/page";
import SignUpForm from "@/components/SignInForm";

export default async function Home() {
  
const session = await auth();
console.log(session); 
  return (
    <div>
      {!session? (
        <div className="flex justify-center items-center flex-col m-2 w-full">
      <SignUpForm/>
      <SignIn />

      </div>
      )
      :(
        <div>
      <Page/>
      
      </div>
      )
} 
    
    </div>
  )
}
