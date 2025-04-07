import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";

export default function NewExpense() {
  const navigate = useNavigate();

  const handleCreateExpense = (expense) => {
    // in a real app, you would send this to your api
    console.log("Creating expense:", expense);

    // navigate to the groups page
    navigate("/groups");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create Expense</h1>
      </div>

      <ExpenseForm
        onSubmit={handleCreateExpense}
        groupId="group-123" // this would typically come from the url or props
      />
    </div>
  );
}
