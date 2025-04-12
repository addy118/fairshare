import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toPDF } from "@/lib/pdf-export";
// import { toPDF } from "@/lib/pdf-export";

export default function PaymentHistoryExport({ history, groupName }) {
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleExportToPDF = async () => {
    console.log("exporting...")
    if (!exportRef.current) return;

    setIsExporting(true);

    try {
      console.log("async work starts...")
      await toPDF(exportRef.current, {
        filename: `${groupName || "Group"}_Payment_History.pdf`,
        page: {
          marginTop: 10,
          marginBottom: 15,
          marginLeft: 10,
          marginRight: 10,
        },
      });
      console.log("async work ended!")
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No payment history available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={handleExportToPDF}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export to PDF"}
        </Button>
      </div>

      <div ref={exportRef} className="pdf-container">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>Payments History</CardTitle>
            <CardDescription>{`All payments in the group ${groupName || ""}`}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="payment-card mb-6 overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {item.name || "Settlement"}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center">
                          {formatDate(item.timestamp)}
                        </CardDescription>
                      </div>

                      <div className="flex items-center">
                        <span className="mr-2 font-bold">
                          ${(item.totalAmt || item.amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="pdf-flex-row">
                      {item.type === "expense" ? (
                        // type expense
                        <div className="pdf-flex-item">
                          <h4 className="mb-3 font-medium">Payers</h4>
                          <div className="space-y-3">
                            {item.payers?.map((payer, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                      {payer.payer.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{payer.payer.name}</span>
                                </div>
                                <span
                                  className={`font-medium ${payer.paidAmt === 0 ? "" : "text-red-600"}`}
                                >
                                  ${(payer.paidAmt || 0).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // type split
                        <div className="pdf-flex-item space-y-6">
                          {/* debitor */}
                          <div>
                            <h4 className="mb-3 font-medium">Debitor</h4>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {item.debtor?.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{item.debtor?.name}</span>
                              </div>
                              <span className="font-medium text-red-600">
                                ${(item.amount || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* creditor */}
                          <div>
                            <h4 className="mb-3 font-medium">Creditor</h4>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {item.creditor?.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{item.creditor?.name}</span>
                              </div>
                              <span className="font-medium text-green-600">
                                ${(item.amount || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* balance post pay */}
                      <div className="pdf-flex-item">
                        <h4 className="mb-3 font-medium">
                          Balance After This Transaction
                        </h4>
                        <div className="space-y-3">
                          {item.balance?.map((balance, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>
                                    {balance.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{balance.user.name}</span>
                              </div>
                              {balance.amount > 0 ? (
                                <span className="font-medium text-green-600">
                                  ${balance.amount.toFixed(2)}
                                </span>
                              ) : balance.amount < 0 ? (
                                <span className="font-medium text-red-600">
                                  -${Math.abs(balance.amount).toFixed(2)}
                                </span>
                              ) : (
                                <span className="font-medium">$0.00</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
