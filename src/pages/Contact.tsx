import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router";
import { contactOptions, contactFAQs } from "@/constants/contactPage";
import { contactFormSchema, ContactFormValues } from "@/validations/userSchema";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Motion components
const MotionDiv = motion.div;
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionH1 = motion.h1;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (_data: ContactFormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
        variant: "default",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
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

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, type: "spring", stiffness: 90 },
    }),
    hover: {
      y: -5,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="container h-dvh mx-auto px-8 md:px-12 lg:px-24 py-8 overflow-scroll no-scrollbar bg-gradient-to-br from-slate-50 to-blue-50">
      <MotionDiv
        className="max-w-5xl mx-auto space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <MotionDiv variants={itemVariants} className="flex">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1 text-primary-blue hover:bg-blue-100"
          >
            <Link to="/">
              <Icon icon={"mingcute:arrow-left-line"} className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </MotionDiv>

        <MotionDiv className="text-center" variants={itemVariants}>
          <MotionH1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </MotionH1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Have questions about GEMS? We&apos;re here to help! Reach out to us
            through any of the channels below or send us a message.
          </motion.p>
        </MotionDiv>

        <div className="grid md:grid-cols-3 gap-8">
          {contactOptions.map((option, index) => (
            <MotionCard
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-blue-50"
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <CardContent className="p-6 text-center">
                <motion.div
                  className="flex justify-center mb-5"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
                    <Icon
                      icon={option.icon}
                      className="h-8 w-8 text-primary-blue"
                    />
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">
                  {option.title}
                </h3>
                <p className="font-medium mb-1 text-slate-700">
                  {option.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </MotionCard>
          ))}
        </div>

        <MotionCard
          className="shadow-xl border-none overflow-hidden bg-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          viewport={{ once: true }}
        >
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-center text-2xl">Get in Touch</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100">
                <TabsTrigger
                  value="form"
                  className="data-[state=active]:bg-primary-blue data-[state=active]:text-white transition-all py-2.5"
                >
                  Send a Message
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="data-[state=active]:bg-primary-blue data-[state=active]:text-white transition-all py-2.5"
                >
                  Common Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6" // Increased spacing
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {" "}
                      {/* Increased gap */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="py-2.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="johndoe@example.com"
                                {...field}
                                className="py-2.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="How can we help you?"
                              {...field}
                              className="py-2.5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide details about your inquiry..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <MotionButton
                        type="submit"
                        className="w-full bg-primary-blue hover:bg-blue-700 transition-colors py-3 text-base"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <Icon
                              icon="mingcute:loading-fill"
                              className="animate-spin mr-2 h-5 w-5"
                            />
                            Sending...
                          </div>
                        ) : (
                          "Send Message"
                        )}
                      </MotionButton>
                    </div>
                  </motion.form>
                </Form>
              </TabsContent>

              <TabsContent value="faq">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Accordion type="single" collapsible className="w-full">
                    {contactFAQs.map((faq, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </MotionCard>

        {/* Footer */}
        <MotionDiv
          className="py-8 border-t border-slate-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
              <h3 className="text-xl font-bold text-primary-blue mr-2">GEMS</h3>
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
              transition={{ delay: 0.3, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to="/contact" // Should this be different if already on contact page? Or to other pages like Privacy/Terms
                className="text-primary-blue hover:text-blue-700 text-sm"
              >
                Contact
              </Link>
              <Link
                to="/privacy" // Assuming you have these routes
                className="text-primary-blue hover:text-blue-700 text-sm"
              >
                Privacy
              </Link>
              <Link
                to="/terms" // Assuming you have these routes
                className="text-primary-blue hover:text-blue-700 text-sm"
              >
                Terms
              </Link>
            </motion.div>
          </div>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
};

export default Contact;
