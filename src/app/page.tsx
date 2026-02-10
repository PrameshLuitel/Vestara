import Header from '@/components/header';
import Homepage from '@/components/homepage';
import PredictiveSuite from '@/components/predictive-suite';
import VestaraGpt from '@/components/vestara-gpt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="home" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-card/20 backdrop-blur-lg border border-white/10 p-1 h-12 rounded-xl">
                <TabsTrigger value="home" className="data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg px-6 text-base text-muted-foreground">Home</TabsTrigger>
                <TabsTrigger value="predictive-suite" className="data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg px-6 text-base text-muted-foreground">Predictive Suite</TabsTrigger>
                <TabsTrigger value="vestara-gpt" className="data-[state=active]:bg-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg px-6 text-base text-muted-foreground">Vestara Gpt</TabsTrigger>
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
      </div>
    </div>
  );
}
