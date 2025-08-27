import Header from '@/components/header';
import Homepage from '@/components/homepage';
import PredictiveSuite from '@/components/predictive-suite';
import VestaraGpt from '@/components/vestara-gpt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="home" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="predictive-suite">Predictive Suite</TabsTrigger>
                <TabsTrigger value="vestara-gpt">Vestara Gpt</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="home">
              <Homepage />
            </TabsContent>
            <TabsContent value="predictive-suite">
              <PredictiveSuite />
            </TabsContent>
            <TabsContent value="vestara-gpt">
              <VestaraGpt />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
