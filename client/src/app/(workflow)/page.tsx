import Flow from "@/app/(workflow)/workflow";
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gray-200 px-5 pb-5">
      <SignedIn>
        <div className="h-full w-full bg-gray-100 rounded-md">
          <Flow />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/" />
      </SignedOut>
    </div>
  );
}
