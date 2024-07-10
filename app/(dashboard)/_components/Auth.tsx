import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import UserMenu from "@/app/(dashboard)/_components/UserMenu";

export default function Auth() {
  return (
    <>
      <ClerkLoading>
        <div className="flex items-center">
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <Button asChild>
            <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard" />
          </Button>
          <div className="hidden sm:block">
            <Button asChild variant="secondary">
              <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard" />
            </Button>
          </div>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </ClerkLoaded>
    </>
  );
}
