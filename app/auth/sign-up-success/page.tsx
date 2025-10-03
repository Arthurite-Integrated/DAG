import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">Account Created Successfully!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-sm text-muted-foreground">
              We've sent a verification email to your inbox. Please click the link in the email to activate your account
              before signing in.
            </p>
            <Button asChild className="w-full bg-[#15356E] text-white hover:bg-[#15356E]/90">
              <Link href="/auth/login">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
