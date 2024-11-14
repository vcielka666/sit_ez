import DashboardWrapper from "@/components/DashboardWrapper"
import React from "react";
// import { auth } from "../../../auth"
// import { redirect } from "next/navigation";




const Page = async () =>  {
    // const session = await auth();
    // if(!session?.user) {
    //     redirect("/")
    // }


    return (
        <div>
    <DashboardWrapper/>
 
    </div>
    )

}

export default Page