import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { GroupContext } from "@/pages/Group";
import UserPic from "./UserPic";
import formatDate from "@/utils/formatDate";
import { fetchHistory } from "@/utils/fetchGroupData";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PaymentHistory() {
  const { id: groupId } = useParams();
  const { group } = useContext(GroupContext);
  const [expandedItems, setExpandedItems] = useState({});
  const { history, setHistory } = useContext(GroupContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef(null);

  // refresh history
  useEffect(() => {
    const refreshHistory = async () => {
      const newHistory = await fetchHistory(groupId);
      setHistory(newHistory);
    };
    refreshHistory();
  }, [groupId]);

  const toggleAll = () => {
    console.log("clicked toggle all");

    // toggle the deciding flag
    const newState = !isExpanded;
    setIsExpanded(newState);

    setExpandedItems(
      newState
        ? history.reduce((acc, entry) => ({ ...acc, [entry.id]: true }), {})
        : {}
    );
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!history || history.length === 0) {
    return (
      <Card className="glass-dark border border-gray-700/50 shadow-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-400">No payment history available.</p>
        </CardContent>
      </Card>
    );
  }

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Save the current expanded state to restore later
      const originalExpandedState = { ...expandedItems };

      // Expand all items
      setExpandedItems(
        history.reduce((acc, entry) => ({ ...acc, [entry.id]: true }), {})
      );

      // Wait for state update and DOM rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!pdfRef.current) {
        console.error("PDF container reference is null");
        return;
      }

      // Add a temporary class to use basic colors instead of oklch
      document.body.classList.add("pdf-export-mode");

      try {
        // Create PDF with a specific page size
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const container = pdfRef.current;

        // Generate canvas with simplified options
        const canvas = await html2canvas(container, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        // Get dimensions
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          imgWidth,
          imgHeight
        );

        // If content is too tall, add more pages
        let heightLeft = imgHeight;
        let position = 0;

        // Remove the first page height
        heightLeft -= pdf.internal.pageSize.getHeight();

        // Add new pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
          );
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        // Save the PDF
        pdf.save(`${group.name}_payment_history.pdf`);

        console.log("PDF export completed successfully");
      } catch (err) {
        console.error("Error during PDF generation:", err);
        alert("Failed to generate PDF. Please try again.");
      }
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      // Remove the temporary class
      document.body.classList.remove("pdf-export-mode");

      // Restore original expanded state
      setExpandedItems(originalExpandedState);
      setIsExporting(false);
    }
  };

  return (
    <>
      <Card className="glass-dark mx-auto mb-20 max-w-4xl border border-gray-700/50 px-4 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="gradient-text">Payments History</CardTitle>
            <CardDescription className="text-gray-300">{`All payments in the group ${group.name}`}</CardDescription>
          </div>

          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={toggleAll}
              className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
            >
              Toggle All
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-gray-700 hover:bg-gray-700/70 hover:text-teal-400"
            >
              {isExporting ? (
                <Loading action="Exporting" item="history" />
              ) : (
                "Export History"
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div ref={pdfRef} className="payment-history-container space-y-4">
            {history?.map((item) => (
              <Card
                key={item.id}
                className="payment-card glass-dark overflow-hidden border border-gray-700/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-300">
                        {item.name || "Settlement"}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center text-gray-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(item.timestamp)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center">
                      <span className="mr-2 font-bold text-teal-400">
                        ₹{item.totalAmt?.toFixed(2) || item.amount?.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="no-print h-8 w-8 p-0 hover:text-teal-400"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {expandedItems?.[item.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* payment details ( expense / split ) */}
                {expandedItems?.[item.id] && (
                  <CardContent>
                    <div className="flex items-start space-x-12">
                      {item.type == "expense" ? (
                        // type expense
                        <div className="flex-1">
                          <h4 className="mb-3 font-medium text-gray-300">
                            Payers
                          </h4>
                          <div className="space-y-3">
                            {item.payers?.map((payer, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-6 w-6 border border-gray-700">
                                    <UserPic name={payer.payer.name} />
                                  </Avatar>

                                  <span className="text-gray-300">
                                    {payer.payer.name}
                                  </span>
                                </div>

                                <span
                                  className={`font-medium ${payer.paidAmt == 0 ? "text-gray-300" : "text-red-600"}`}
                                >
                                  ₹{payer.paidAmt.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // type split
                        <div className="flex-1 space-y-6">
                          {/* debitor */}
                          <div>
                            <h4 className="mb-3 font-medium text-gray-300">
                              Debitor
                            </h4>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-6 w-6 border border-gray-700">
                                  <UserPic name={item.debtor.name} />
                                </Avatar>
                                <span className="text-gray-300">
                                  {item.debtor.name}
                                </span>
                              </div>
                              <span className="font-medium text-red-600">
                                ₹{item.amount?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* creditor */}
                          <div>
                            <h4 className="mb-3 font-medium text-gray-300">
                              Creditor
                            </h4>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-6 w-6 border border-gray-700">
                                  <UserPic name={item.creditor.name} />
                                </Avatar>
                                <span className="text-gray-300">
                                  {item.creditor.name}
                                </span>
                              </div>
                              <span className="font-medium text-green-600">
                                ₹{item.amount?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* balance post pay */}
                      <div className="flex-1">
                        <h4 className="mb-3 font-medium text-gray-300">
                          Balance After This Transaction
                        </h4>
                        <div className="space-y-3">
                          {item.balance?.map((balance, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-6 w-6 border border-gray-700">
                                  <UserPic name={balance.user.name} />
                                </Avatar>
                                <span className="text-gray-300">
                                  {balance.user.name}
                                </span>
                              </div>
                              {balance.amount > 0 ? (
                                <span className="font-medium text-green-600">
                                  ₹{balance.amount.toFixed(2)}
                                </span>
                              ) : balance.amount < 0 ? (
                                <span className="font-medium text-red-600">
                                  ₹{Math.abs(balance.amount).toFixed(2)}
                                </span>
                              ) : (
                                <span className="font-medium text-gray-300">
                                  ₹0.00
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
