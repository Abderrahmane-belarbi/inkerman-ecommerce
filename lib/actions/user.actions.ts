"use server";
import { signIn, signOut } from "@/auth";
import { IUserSignIn } from "@/types";
import { redirect } from "next/navigation";

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn("credentials", { ...user, redirect: false });
  // we dont want to redirect user automatically after signin, we want to do it manually from the form
}
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};