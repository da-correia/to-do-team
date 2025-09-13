import AddDebtSheet from "@/components/dashboard/add-debt-sheet/add-debt-sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";

const Debts = () => {
  return (
    <>
      <div className="flex w-full justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Debts</h1>
          <p className="text-muted-foreground">Manage your debts here</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Add Debt</Button>
          </SheetTrigger>
          <AddDebtSheet />
        </Sheet>
      </div>
    </>
  );
};

export default Debts;
