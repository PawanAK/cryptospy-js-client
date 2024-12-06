import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LandingPageProps {
  onCreateRoom: () => void;
}

export function LandingPage({ onCreateRoom }: LandingPageProps) {
  console.log("onCreateRoom", onCreateRoom)
  console.log("LandingPage", { onCreateRoom })
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to CryptoWatch</CardTitle>
          <CardDescription>Real-time cryptocurrency prices at your fingertips</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Stay on top of the crypto market with our simple, fast, and accurate price tracking tool.</p>
          <Button onClick={onCreateRoom} className="w-full">
            Start Watching
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
