import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Video, Users, Shield, Calendar } from 'lucide-react'
import Image from 'next/image'

interface LandingPageProps {
  onCreateRoom: () => void;
}

export function LandingPage({ onCreateRoom }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <Image src="/huddle-logo.png" alt="Huddle Logo" width={40} height={40} />
          <span className="text-xl font-medium text-gray-800">Huddle</span>
        </div>
        <Button 
          onClick={onCreateRoom}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
        >
          New meeting
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Premium video meetings. Now free for everyone.
            </h1>
            <p className="text-xl text-gray-600">
              We re-engineered the service we built for secure business meetings to make it free and available for all.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onCreateRoom}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md text-lg flex items-center space-x-2"
              >
                <Video className="w-5 h-5" />
                <span>New Meeting</span>
              </Button>
              <Button 
                variant="outline"
                className="border-2 px-8 py-6 rounded-md text-lg text-gray-600 hover:bg-gray-50"
              >
                Enter meeting code
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
              icon={Users}
              title="See everyone together"
              description="Up to 100 participants can join a meeting"
            />
            <FeatureCard
              icon={Shield}
              title="Safe and secure"
              description="End-to-end encryption keeps your meetings private"
            />
            <FeatureCard
              icon={Calendar}
              title="Easy scheduling"
              description="Integrate with your calendar for seamless scheduling"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
}