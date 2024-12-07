import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, Zap, Brain, Coins } from 'lucide-react'
import Image from 'next/image'

interface LandingPageProps {
  onCreateRoom: () => void;
}

export function LandingPage({ onCreateRoom }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Image src="https://res.cloudinary.com/dsvjf1ede/image/upload/v1733581762/nlclnj9cksrfy8umt9zt.jpg" alt="CryptoSpy Logo" width={60} height={60} />
          <span className="text-xl font-medium text-gray-100">CryptoSpy</span>
        </div>
        <Button 
          onClick={onCreateRoom}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        >
          Create Room
        </Button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-100 leading-tight">
              Real-time crypto intel for your meetings.
            </h1>
            <p className="text-xl text-gray-300">
              CryptoSpy delivers real-time cryptocurrency price updates with a sleek, no-BS interface. Stay ahead in the crypto game—anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onCreateRoom}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-md text-lg flex items-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Create Room</span>
              </Button>
              <Button 
                variant="outline"
                className="border-2 px-8 py-6 rounded-md text-lg text-gray-300 hover:bg-gray-700"
              >
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-6"
          >
            <FeatureCard
              icon={Zap}
              title="Lightning-fast updates"
              description="Get real-time cryptocurrency price updates in seconds"
            />
            <FeatureCard
              icon={Brain}
              title="AI-powered analysis"
              description="AI analyzes meetings live and provides relevant price info"
            />
            <FeatureCard
              icon={Coins}
              title="Comprehensive coverage"
              description="Track prices for all major cryptocurrencies and tokens"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="p-6 border rounded-xl hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="bg-green-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100">{title}</h3>
          <p className="text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
}

