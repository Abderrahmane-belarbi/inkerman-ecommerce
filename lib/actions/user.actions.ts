"use server";
import { auth, signIn, signOut } from "@/auth";
import { IUserName, IUserSignIn, IUserSignUp } from "@/types";
import { redirect } from "next/navigation";
import { UserSignUpSchema } from "../validator";
import { connectToDatabase } from "../db";
import User from "../db/models/user.model";
import bcrypt from "bcryptjs";
import { formatError } from "../utils";

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn("credentials", { ...user, redirect: false });
  // we dont want to redirect user automatically after signin, we want to do it manually from the form
}

export const SignInWithGoogle = async () => {
  await signIn("google");
};
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect); // Manually redirects the user to the sign-out page after logout.
};

// Create User
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    // Uses UserSignUpSchema to validate the input data asynchronously.
    // If validation fails, an error is thrown, and the function skips further execution.
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });
    await connectToDatabase();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase();
    const session = await auth();
    const currentUser = await User.findById(session?.user?.id);
    if (!currentUser) throw new Error("User not found");
    currentUser.name = user.name;
    const updatedUser = await currentUser.save();
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
