"use client"

import { AlertCircle, CheckCircle2, Database, Play } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/50 border-slate-800">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/dag-logo.png" alt="DAG Industries" width={200} height={60} className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl text-white">Database Setup Required</CardTitle>
          <CardDescription className="text-slate-400">
            Complete these steps to initialize your attendance monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-950/50 border-amber-900 text-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Not Complete</AlertTitle>
            <AlertDescription>
              The database tables have not been created yet. Please run the SQL scripts to set up your database.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Setup Steps
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">Run Database Scripts</h4>
                  <p className="text-sm text-slate-400 mb-2">
                    Execute the following SQL scripts in order from the scripts folder:
                  </p>
                  <ul className="text-sm text-slate-400 space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <Play className="h-3 w-3" />
                      001_create_tables.sql
                    </li>
                    <li className="flex items-center gap-2">
                      <Play className="h-3 w-3" />
                      002_enable_rls.sql
                    </li>
                    <li className="flex items-center gap-2">
                      <Play className="h-3 w-3" />
                      003_create_functions.sql
                    </li>
                    <li className="flex items-center gap-2">
                      <Play className="h-3 w-3" />
                      004_seed_data.sql
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">Verify Setup</h4>
                  <p className="text-sm text-slate-400">
                    After running the scripts, refresh this page to verify the setup is complete.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">Login with Default Credentials</h4>
                  <p className="text-sm text-slate-400 mb-2">Use these credentials to access the system:</p>
                  <div className="text-sm text-slate-300 space-y-1 bg-slate-900/50 p-3 rounded border border-slate-700">
                    <div>
                      <span className="text-slate-500">Email:</span> admin@dagindustries.com
                    </div>
                    <div>
                      <span className="text-slate-500">Password:</span> Admin@123
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => window.location.reload()} className="flex-1">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify Setup
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
