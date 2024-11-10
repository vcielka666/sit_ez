"use client"
import DashboardWrapper from "@/components/DashboardWrapper"
import LoginGoogle from "@/components/Login"


interface SessionData{
    session:boolean
}

const Page = () => {

const session = true;

    return (
        <div>
    {session?
    <div>
    <DashboardWrapper/>
    </div>
    :
    <LoginGoogle /> 
    }
    
    </div>
    )

}

export default Page