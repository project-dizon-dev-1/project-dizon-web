import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { features, steps } from "@/constants/homePage";
import { Icon } from "@iconify/react/dist/iconify.js";

const Homepage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="container h-dvh mx-auto px-8 md:px-12 lg:px-24 py-8 overflow-scroll no-scrollbar bg-gradient-to-br">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            {/* <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full">
              <Icon
                icon="mingcute:building-4-fill"
                className="w-8 h-8 text-primary-blue"
              />
            </div> */}
            <h1 className="text-5xl font-bold text-primary-blue mb-2">GEMS</h1>
            <p className="text-xl font-medium">Estate Management System</p>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Digitalize your way of managing estates with our comprehensive
            system. From tracking properties to managing finances, GEMS has you
            covered.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Button className="bg-primary-blue hover:bg-primary-blue">
              <Link to={"/login"}>Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="py-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Key Features</h2>
            <p className="text-muted-foreground">
              Explore what our system has to offer
            </p>
          </div>
          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                className="bg-gradient-to-br from-blue-100/90 via-indigo-200/50 to-purple-200/90 border-none shadow-md"
                key={index}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                      <Icon
                        icon={feature.icon}
                        className="h-7 w-7 text-primary-blue"
                      />
                    </div>
                  </div>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="py-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">How to Use the System</h2>
            <p className="text-muted-foreground">
              Follow these simple steps to get started
            </p>
          </div>
          <Separator className="my-4" />

          <Card className="shadow-md border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-center">Step-by-Step Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs
                value={`step-${activeStep}`}
                onValueChange={(value) =>
                  setActiveStep(parseInt(value.replace("step-", "")))
                }
              >
                <TabsList className="grid grid-cols-4 mb-8">
                  {steps.map((_, index) => (
                    <TabsTrigger
                      key={index}
                      value={`step-${index}`}
                      className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
                    >
                      Step {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {steps.map((step, index) => (
                  <TabsContent
                    key={index}
                    value={`step-${index}`}
                    className="mt-6 space-y-4"
                  >
                    <h3 className="text-xl font-semibold">{step.label}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    <div className="flex justify-between mt-4">
                      <Button
                        onClick={handleBack}
                        disabled={index === 0}
                        className="bg-primary-blue hover:bg-primary-blue gap-1"
                      >
                        <Icon
                          icon="mingcute:arrow-left-line"
                          className="w-4 h-4"
                        />
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={index === steps.length - 1}
                        className="bg-primary-blue hover:bg-primary-blue gap-1"
                      >
                        Next
                        <Icon
                          icon="mingcute:arrow-right-line"
                          className="w-4 h-4"
                        />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {activeStep === steps.length && (
                <div className="bg-muted p-6 rounded-lg mt-6 text-center">
                  <p className="mb-4">
                    All steps completed - you&apos;re ready to use the system!
                  </p>
                  <Button onClick={handleReset}>Reset</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to action & Contact Us */}
        <div className="flex flex-col md:flex-row h-auto md:h-48 justify-evenly bg-gradient-to-r from-blue-600 to-indigo-600 py-12 px-8 rounded-xl text-center text-white shadow-lg">
          {/* Call to action */}
          <div className="flex flex-col justify-center mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <Button
              size="lg"
              variant="outline"
              className="mt-2 bg-white text-primary-blue hover:bg-white/90 self-center"
            >
              <Link to={"/signup"}>Sign Up</Link>
            </Button>
          </div>

          <Separator
            className="bg-white/20 h-auto w-px mx-8 hidden md:block"
            orientation="vertical"
          />

          {/* Contact Us */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Have more questions?</h2>
            <Button
              size="lg"
              variant="outline"
              className="mt-2 bg-white text-primary-blue hover:bg-white/90 self-center"
            >
              <Link to={"/contact"}>Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} GEMS Estate Management System. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
