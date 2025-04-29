import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { FAQS, features, steps } from "@/constants/homePage";
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
    <div className="container h-dvh mx-auto px-44 py-12 overflow-scroll no-scrollbar">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">GEMS: Estate Management</h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Digitalize your way of managing estates with our comprehensive
            system. From tracking properties to managing finances, GEMS has you
            covered.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Button>
              {" "}
              <Link to={"/login"}>Get Started</Link>
            </Button>
            {/* <Button variant="outline">Learn More</Button> */}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="py-8 space-y-6">
          <h2 className="text-3xl font-bold text-center">Key Features</h2>
          <Separator className="my-4 " />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                className="flex flex-col items-center bg-gradient-to-br from-blue-100/90 via-indigo-200/50 to-purple-200/90"
                key={index}
              >
                <CardHeader className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center justify-center h-12 w-12 mb-2">
                    <Icon
                      icon={feature.icon}
                      className="w-8 h-8 text-primary"
                    />
                  </div>
                  <CardTitle className="text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="py-8 space-y-6">
          <h2 className="text-3xl font-bold text-center">
            How to Use the System
          </h2>
          <Separator className="my-4" />

          <div className="max-w-2xl mx-auto">
            <Tabs
              value={`step-${activeStep}`}
              onValueChange={(value) =>
                setActiveStep(parseInt(value.replace("step-", "")))
              }
            >
              <TabsList className="grid grid-cols-4">
                {steps.map((_, index) => (
                  <TabsTrigger key={index} value={`step-${index}`}>
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
                  <p>{step.description}</p>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={index === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNext}
                      disabled={index === steps.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {activeStep === steps.length && (
              <div className="bg-muted p-6 rounded-lg mt-6 text-center">
                <p className="mb-4">
                  All steps completed - you`&apos;re ready to use the system!
                </p>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-8 space-y-6">
          <h2 className="text-3xl font-bold text-center">
            Frequently Asked Questions
          </h2>
          <Separator className="my-4" />

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((FAQ) => (
                <AccordionItem key={FAQ.question} value={FAQ.question}>
                  <AccordionTrigger>{FAQ.question}</AccordionTrigger>
                  <AccordionContent>{FAQ.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="flex h-42 justify-evenly bg-muted py-12 px-6 rounded-lg text-center ">
          {/* Call to action */}
          <div>
            <h2 className="text-3xl font-bold">Ready to get started?</h2>

            <Button size="lg" className="mt-4">
              <Link to={"/signup"}>Sign Up</Link>
            </Button>
          </div>
          <Separator className=" bg-gray-500 h-32" orientation="vertical" />

          {/* Contact Us */}
          <div>
            <h2 className="text-3xl font-bold text-center">
              Have more questions?
            </h2>

            <div className="text-center">
              <Button className="mt-4">
                <Link to={"/contact"}>Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
