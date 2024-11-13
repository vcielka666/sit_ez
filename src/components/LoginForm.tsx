
import Link from "next/link";
import { signIn } from "next-auth/react"; // Import directly from next-auth/react
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "./ui/form";

export function LoginForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-2/3 space-y-6">
      <FormLabel>
        Login to your admin dashboard or{" "}
        <Link className="text-[green]" href="/signin">
          create a new admin account
        </Link>
      </FormLabel>

      <FormDescription>
        This is an admin page, use it to configure your reservation system. Manage free seats, tables, etc.
      </FormDescription>

      {/* Google Sign-In Button */}
      <Button
        type="button"
        onClick={() => signIn("google")} // Direct call to signIn
        className="mt-4"
      >
        Sign in with Google
      </Button>
    </form>
  );
}
