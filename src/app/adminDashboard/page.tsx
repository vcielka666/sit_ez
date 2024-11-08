"use client"
import DashboardWrapper from "@/components/DashboardWrapper"
import Login from "@/components/Login"

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
    <Login /> 
    }
    
    </div>
    )

}

export default Page