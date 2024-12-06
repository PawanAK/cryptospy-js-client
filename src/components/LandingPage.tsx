import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Clock } from 'lucide-react'

interface LandingPageProps {
  onCreateRoom: () => void;
}

export function LandingPage({ onCreateRoom }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl p-8"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <CardTitle className="text-4xl font-extrabold text-white mb-2">Welcome to CryptoWatch</CardTitle>
              <CardDescription className="text-xl text-white/80">Real-time cryptocurrency prices at your fingertips</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <FeatureItem icon={TrendingUp} title="Live Updates" description="Get real-time price updates for all major cryptocurrencies" />
              <FeatureItem icon={DollarSign} title="Multiple Currencies" description="Track prices in various fiat currencies" />
              <FeatureItem icon={Clock} title="24/7 Monitoring" description="Never miss a market movement with round-the-clock tracking" />
            </div>
            <div className="flex flex-col items-center space-y-6">
              <p className="text-white text-lg text-center">Stay on top of the crypto market with our simple, fast, and accurate price tracking tool.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={onCreateRoom} className="w-full text-lg font-semibold px-8 py-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0 rounded-full shadow-lg">
                  Start Watching Now
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function FeatureItem({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-4"
    >
      <div className="bg-white/20 p-3 rounded-full">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </motion.div>
  )
}

