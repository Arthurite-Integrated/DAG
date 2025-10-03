import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {params?.error_description ? (
              <p className="mb-6 text-sm text-muted-foreground">{params.error_description}</p>
            ) : params?.error ? (
              <p className="mb-6 text-sm text-muted-foreground">Error code: {params.error}</p>
            ) : (
              <p className="mb-6 text-sm text-muted-foreground">An unexpected error occurred during authentication.</p>
            )}
            <Button asChild className="w-full bg-[#15356E] text-white hover:bg-[#15356E]/90">
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
