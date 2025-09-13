"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import React from "react";

const createDebtSchema = z.object({
  debt_name: z.string().min(1, "Field cannot be empty"),
  balance: z.number().min(1, "Field is required"),
  interest_rate: z.number().min(1, ""),
  minimum_payment: z.number().min(1, ""),
});

const AddDebtSheet = () => {
  const form = useForm({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      debt_name: "",
      balance: 0,
      interest_rate: 0,
      minimum_payment: 0,
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add Debt</SheetTitle>
        <SheetDescription>Add a new debt entry</SheetDescription>
      </SheetHeader>
      {/*Sheet Body*/}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 text-left"
        >
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
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
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Save changes</Button>
        </form>
      </Form>
      {/*Sheet Footer*/}
      <SheetFooter>
        <Button type="submit">Add Debt</Button>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default AddDebtSheet;
