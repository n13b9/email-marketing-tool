import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-amber-600">
      <SignIn />
    </div>
  );
}
