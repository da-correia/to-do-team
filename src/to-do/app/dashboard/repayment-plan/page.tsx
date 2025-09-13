"use client"; // MUST be the first line

import React, { useEffect, useState } from "react";
import { RepaymentPlanService } from "@/lib/services/repaymentPlan";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CustomLoader from "@/components/CustomLoader";

interface PlanSummary {
  totalBalance: number;
  projectedBalanceAfter: number;
  pastPayments: number;
  projectedFuturePayments: number;
  projectedInterest: number;
  payoffEstimate: string;
  projectionStart: string;
  projectionEnd: string;
  projectionDays: number;
  totalDebts: number;
}

const RepaymentPlanPage: React.FC = () => {
  const [summary, setSummary] = useState<PlanSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debtTypes, setDebtTypes] = useState<string[] | null>([]);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [daysFilter, setDaysFilter] = useState<number>(30);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await RepaymentPlanService.getPlanSummary(1, daysFilter, {
        type: typeFilter,
      });

      const debtTypeData = await RepaymentPlanService.getDebtType();

      setDebtTypes(debtTypeData);

      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Error fetching plan summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);


  if(loading) return <CustomLoader/>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Repayment Plan Summary</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Debt Type</Label>
            <Select onValueChange={setTypeFilter} value={typeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              {debtTypes === null || debtTypes.length === 0 ? (
                ""
              ) : (
                <SelectContent>
                  {debtTypes!.map((dt) => (
                    <SelectItem key={dt} value={dt}>
                      {dt}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>

          <div>
            <Label>Projection Days</Label>
            <Input
              type="number"
              min={1}
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchSummary}>Apply Filters</Button>
        </CardFooter>
      </Card>

      {/* Loading/Error */}
      {loading && (
        <Card>
          <CardContent>Loading repayment plan...</CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardContent className="text-red-600">Error: {error}</CardContent>
        </Card>
      )}

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Debts</CardTitle>
            </CardHeader>
            <CardContent>{summary.totalDebts}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Balance Now</CardTitle>
            </CardHeader>
            <CardContent>${summary.totalBalance.toLocaleString()}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Projected Balance After {summary.projectionDays} Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              ${summary.projectedBalanceAfter.toLocaleString()}
            </CardContent>
            <CardFooter>
              Period: {summary.projectionStart} → {summary.projectionEnd}
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payments Made (Past)</CardTitle>
            </CardHeader>
            <CardContent>${summary.pastPayments.toLocaleString()}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Projected Payments (Next {summary.projectionDays} Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              ${summary.projectedFuturePayments.toLocaleString()}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Estimated Interest (Next {summary.projectionDays} Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              ${summary.projectedInterest.toLocaleString()}
            </CardContent>
          </Card>
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Estimated Payoff</CardTitle>
            </CardHeader>
            <CardContent>{summary.payoffEstimate}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RepaymentPlanPage;

