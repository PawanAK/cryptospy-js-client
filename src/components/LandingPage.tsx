import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Clock } from 'lucide-react'

interface LandingPageProps {
  onCreateRoom: () => void;
}

export function LandingPage({ onCreateRoom }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl p-4 sm:p-8"
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <CardTitle className="text-3xl sm:text-5xl font-bold text-white tracking-tight">CryptoWatch</CardTitle>
              <CardDescription className="text-lg sm:text-xl text-white/70 mt-4 font-light">Real-time cryptocurrency prices at your fingertips</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-12 items-start px-6 sm:px-8">
            <div className="space-y-8">
              <FeatureItem icon={TrendingUp} title="Live Updates" description="Get real-time price updates for all major cryptocurrencies" />
              <FeatureItem icon={DollarSign} title="Multiple Currencies" description="Track prices in various fiat currencies" />
              <FeatureItem icon={Clock} title="24/7 Monitoring" description="Never miss a market movement with round-the-clock tracking" />
            </div>
            <div className="flex flex-col items-center space-y-8">
              <p className="text-white/80 text-lg text-center leading-relaxed">Stay on top of the crypto market with our simple, fast, and accurate price tracking tool.</p>
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="w-full"
              >
                <Button 
                  onClick={onCreateRoom} 
                  className="w-full text-lg font-medium px-8 py-6 bg-white hover:bg-white/90 text-slate-900 rounded-2xl shadow-lg transition-all duration-200"
                >
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
      className="flex items-start space-x-5 group"
    >
      <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/15 transition-colors duration-200">
        <Icon className="w-6 h-6 text-white/90" />
      </div>
      <div>
        <h3 className="text-xl font-medium text-white/90 mb-2">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}