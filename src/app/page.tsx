import Header from '@/components/header';
import Homepage from '@/components/homepage';
import PredictiveSuite from '@/components/predictive-suite';
import VestaraGpt from '@/components/vestara-gpt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div 
      className="flex flex-col min-h-screen bg-background"
      style={{
          backgroundImage: 'radial-gradient(circle at top left, hsla(210, 80%, 30%, 0.3), transparent 30%), radial-gradient(circle at bottom right, hsla(140, 70%, 40%, 0.3), transparent 30%)',
          backgroundAttachment: 'fixed'
      }}
    >
      <Header />
      <div className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="home" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary border-border text-secondary-foreground">
                <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Home</TabsTrigger>
                <TabsTrigger value="predictive-suite" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Predictive Suite</TabsTrigger>
                <TabsTrigger value="vestara-gpt" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Vestara Gpt</TabsTrigger>
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
