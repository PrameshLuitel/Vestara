import Header from '@/components/header';
import Homepage from '@/components/homepage';
import PredictiveSuite from '@/components/predictive-suite';
import VestaraGpt from '@/components/vestara-gpt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="home" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-transparent p-0 h-12 rounded-lg">
                <TabsTrigger value="home" className="bg-transparent text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 text-base">Home</TabsTrigger>
                <TabsTrigger value="predictive-suite" className="bg-transparent text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 text-base">Predictive Suite</TabsTrigger>
                <TabsTrigger value="vestara-gpt" className="bg-transparent text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 text-base">Vestara Gpt</TabsTrigger>
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
