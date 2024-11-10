import { revalidatePath } from "next/cache";
import { signOut,signIn } from "../auth";

export const login = async (provider: string) => {
    await signIn(provider, { redirectTo:"/localhost:3000/adminDashboard" });
    revalidatePath("/localhost:3000/adminDashboard");

};

export const logout = async () => {
    await signOut({redirectTo: "/" });
    revalidatePath("/");
};