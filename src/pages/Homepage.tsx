import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { features, steps } from "@/constants/homePage";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Create motion components with motion.create() instead of motion()
const MotionDiv = motion.div;
const MotionBadge = motion.create(Badge);
const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;

const Homepage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

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

  const handleNavigation = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(path);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const featureCardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-full h-dvh mx-auto px-8 md:px-12 lg:px-24 py-8 overflow-scroll no-scrollbar bg-blue-50">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section with animations */}
        <MotionDiv
          className="flex flex-col items-center justify-center text-center pt-8 md:pt-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <MotionBadge
            className="mb-4 px-3 py-1 bg-blue-100 text-primary-blue border-primary-blue/20 text-sm"
            variants={itemVariants}
          >
            Estate Management Simplified
          </MotionBadge>

          <MotionH1
            className="text-5xl md:text-6xl font-medium bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            GEMS
          </MotionH1>

          <motion.p
            className="text-xl md:text-2xl font-medium text-slate-700 mb-6"
            variants={itemVariants}
          >
            Estate Management System
          </motion.p>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            Streamline your property management with our intuitive digital
            platform. Monitor properties, oversee finances, and enhance
            community engagement—all in one place.
          </motion.p>

          <motion.div className="flex gap-4" variants={itemVariants}>
            <MotionButton
              size="lg"
              className="bg-primary-blue hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleNavigation("/login", e)}
            >
              Get Started
            </MotionButton>

            <MotionButton
              size="lg"
              variant="outline"
              className="border-primary-blue text-primary-blue hover:bg-blue-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleNavigation("/contact", e)}
            >
              Contact Us
            </MotionButton>
          </motion.div>
        </MotionDiv>

        {/* Features Section with animations */}
        <MotionDiv
          className="py-12 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <MotionDiv className="text-center mb-8" variants={itemVariants}>
            <MotionH2
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
              variants={itemVariants}
            >
              Powerful Features
            </MotionH2>
            <motion.p
              className="text-lg text-muted-foreground max-w-xl mx-auto"
              variants={itemVariants}
            >
              Everything you need to efficiently manage your estate
            </motion.p>
          </MotionDiv>

          <Separator className="my-6 bg-blue-200/50" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MotionCard
                key={index}
                className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50"
                custom={index}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="flex justify-center mb-5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  >
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
                      <Icon
                        icon={feature.icon}
                        className="h-8 w-8 text-primary-blue"
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </MotionDiv>

        {/* How It Works with animations */}
        <MotionDiv
          className="py-12 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <div className="text-center mb-8">
            <MotionH2
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How GEMS Works
            </MotionH2>
            <motion.p
              className="text-lg text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Get started in just a few simple steps
            </motion.p>
          </div>

          <Separator className="my-6 bg-blue-200/50" />

          <MotionDiv
            className="bg-white rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 className="text-xl font-medium text-white text-center">
                Getting Started Guide
              </h3>
            </div>

            <div className="p-6">
              <Tabs
                value={`step-${activeStep}`}
                onValueChange={(value) =>
                  setActiveStep(parseInt(value.replace("step-", "")))
                }
              >
                <TabsList className="grid grid-cols-4 mb-8 bg-slate-100">
                  {steps.map((_, index) => (
                    <TabsTrigger
                      key={index}
                      value={`step-${index}`}
                      className="data-[state=active]:bg-primary-blue data-[state=active]:text-white transition-all"
                    >
                      Step {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {steps.map((step, index) => (
                  <TabsContent
                    key={index}
                    value={`step-${index}`}
                    className="space-y-4"
                  >
                    <MotionDiv
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      key={`step-content-${index}`}
                    >
                      <motion.div
                        className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-primary-blue font-bold">
                          {index + 1}
                        </span>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          {step.label}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </MotionDiv>

                    <div className="flex justify-between mt-8">
                      <MotionButton
                        onClick={handleBack}
                        disabled={index === 0}
                        variant="outline"
                        className="gap-1 border-primary-blue text-primary-blue hover:bg-blue-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon
                          icon="mingcute:arrow-left-line"
                          className="w-4 h-4"
                        />
                        Previous
                      </MotionButton>
                      <MotionButton
                        onClick={handleNext}
                        disabled={index === steps.length - 1}
                        className="bg-primary-blue hover:bg-blue-700 transition-colors gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next
                        <Icon
                          icon="mingcute:arrow-right-line"
                          className="w-4 h-4"
                        />
                      </MotionButton>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </MotionDiv>
        </MotionDiv>

        {/* Call to Action with animations */}
        <MotionDiv
          className="py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <MotionDiv
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-95"></div>

            <div className="relative px-8 py-12 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <MotionDiv
                  className="text-center md:text-left max-w-md"
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to transform your estate management?
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Join the growing number of communities using GEMS to
                    streamline their operations and improve resident
                    satisfaction.
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <MotionButton
                      size="lg"
                      className="bg-white text-primary-blue hover:bg-blue-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleNavigation("/signup", e)}
                    >
                      Sign Up
                    </MotionButton>

                    <MotionButton
                      size="lg"
                      variant="outline"
                      className="bg-white text-primary-blue hover:bg-blue-50 hover:text-blue transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleNavigation("/contact", e)}
                    >
                      Contact Us
                    </MotionButton>
                  </div>
                </MotionDiv>

                <MotionDiv
                  className="hidden md:block"
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon
                        icon="mingcute:building-4-fill"
                        className="w-6 h-6 text-blue-200"
                      />
                      <h3 className="font-medium text-lg">Estate Management</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Streamlined operations",
                        "Better financial tracking",
                        "Enhanced community engagement",
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Icon
                            icon="mingcute:check-fill"
                            className="w-5 h-5 text-blue-200"
                          />
                          <p className="text-sm text-blue-100">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </MotionDiv>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>

        {/* Footer with animations */}
        <MotionDiv
          className="py-8 border-t border-slate-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-medium text-primary-blue mr-2">
                GEMS
              </h3>
              <span className="text-sm text-muted-foreground">
                Estate Management System
              </span>
            </motion.div>

            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} GEMS. All rights reserved.
            </motion.div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button
                variant="link"
                className="text-primary-blue hover:text-blue-700 p-0 h-auto text-sm"
                onClick={(e) => handleNavigation("/contact", e)}
              >
                Contact
              </Button>
              <Button
                variant="link"
                className="text-primary-blue hover:text-blue-700 p-0 h-auto text-sm"
                onClick={(e) => handleNavigation("/privacy", e)}
              >
                Privacy
              </Button>
              <Button
                variant="link"
                className="text-primary-blue hover:text-blue-700 p-0 h-auto text-sm"
                onClick={(e) => handleNavigation("/terms", e)}
              >
                Terms
              </Button>
            </motion.div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default Homepage;
