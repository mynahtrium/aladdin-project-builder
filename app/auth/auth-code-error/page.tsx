"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111111] text-gray-200 p-4">
      <div className="w-full max-w-lg">
        <Card className="border-[#27272a] bg-[#18181b] text-gray-200">
          <CardHeader>
            <CardTitle>Authentication Link Error</CardTitle>
            <CardDescription>
              The sign-in confirmation link could not be exchanged for a session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-300">
            <p>
              Make sure your Supabase project has the correct Site URL and Redirect URLs configured for this app.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Local dev: http://localhost:3000/auth/callback</li>
              <li>Production: https://your-domain.com/auth/callback</li>
            </ul>
            <p className="text-gray-400">
              If you are deploying without HTTPS, email confirmation redirects are expected to fail in many setups.
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                Go back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

