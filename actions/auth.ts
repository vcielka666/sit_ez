"use server"

import { revalidatePath } from "next/cache";
import { signOut,signIn } from "../auth";

export const login = async (provider: string) => {
    await signIn(provider, { redirectTo:"/adminDashboard" });
    revalidatePath("/adminDashboard");

};

export const logout = async () => {
    await signOut({redirectTo: "/" });
    revalidatePath("/");
};