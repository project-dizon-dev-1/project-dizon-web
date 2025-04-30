import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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

    // Simulating form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container h-dvh mx-auto px-8 md:px-12 lg:px-24 py-8 overflow-scroll no-scrollbar bg-gradient-to-br">
      <div className="max-w-5xl mx-auto">
        {/* Add Home Navigation Link */}
        <div className="flex mb-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <Icon icon={"mingcute:arrow-left-line"} className="w-4 h-4" />
            <Link to="/">Back to Home</Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about GEMS? We&apos;re here to help! Reach out to us
            through any of the channels below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactOptions.map((option, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-blue-100/90 via-indigo-200/50 to-purple-200/90 border-none shadow-md"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-14 w-14 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                    <Icon
                      icon={option.icon}
                      className="h-7 w-7 text-primary-blue"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="font-medium mb-1">{option.value}</p>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-md border-none overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-center">Get in Touch</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="form"
                  className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
                >
                  Send a Message
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
                >
                  Common Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
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

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-primary-blue hover:bg-primary-blue"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <Icon
                              icon="mingcute:loading-fill"
                              className="animate-spin mr-2"
                            />
                            Sending...
                          </div>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="faq">
                <div className="space-y-4">
                  {contactFAQs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-medium mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                      {index < contactFAQs.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} GEMS Estate Management System. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
