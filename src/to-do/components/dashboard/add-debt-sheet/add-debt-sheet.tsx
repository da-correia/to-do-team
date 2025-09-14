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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import { debtService } from "@/lib/services/debtService";

const createDebtSchema = z.object({
  debt_name: z.string().min(1, "Field cannot be empty"),
  type: z.string().min(1, "Field cannot be empty"),
  balance: z.string().min(1, "Balance must be a positive number"),
  interest_rate: z.string().min(1, "Interest rate must be a positive number"),
  minimum_payment: z
    .string()
    .min(1, "Minimum payment must be a positive number"),
});

const AddDebtSheet = () => {
  const form = useForm<z.infer<typeof createDebtSchema>>({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      debt_name: "",
      type: "",
      balance: "",
      interest_rate: "",
      minimum_payment: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof createDebtSchema>) => {
    try {
      await debtService.create({
        debt_name: data.debt_name,
        type: data.type,
        balance: parseFloat(data.balance),
        interest_rate: parseFloat(data.interest_rate),
        minimum_payment: parseFloat(data.minimum_payment),
        due_date: new Date(),
      });
      // Reset form after successful creation
      form.reset();
      // You could also close the sheet here if you have access to the close function
    } catch (error) {
      console.error("Error creating debt:", error);
    }
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
          className="w-full space-y-6 text-left px-2"
        >
          <FormField
            control={form.control}
            name="debt_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debt Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your debt name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dept Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="personal_loan">
                          Personal Loan
                        </SelectItem>
                        <SelectItem value="mortgage">Mortgage</SelectItem>
                        <SelectItem value="student_loan">
                          Student Loan
                        </SelectItem>
                        <SelectItem value="auto_loan">Auto Loan</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balance</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate</FormLabel>
                <FormControl>
                  <Input placeholder="0%" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimum_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Payment</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Debt</Button>
        </form>
      </Form>
      {/*Sheet Footer*/}
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default AddDebtSheet;
