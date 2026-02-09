"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return null;
  }

  return user ? (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleSignOut}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  ) : (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleSignIn}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
}
