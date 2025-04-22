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
import { toast } from "sonner";

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

  // Update the handleExport function to add margins and improve color handling
  const handleExport = async () => {
    let originalExpandedState;

    try {
      console.log("Starting PDF export...");
      setIsExporting(true);

      // Save the current expanded state to restore later
      originalExpandedState = { ...expandedItems };
      console.log("Saved original expanded state:", originalExpandedState);

      // Expand all items
      setExpandedItems(
        history.reduce((acc, entry) => ({ ...acc, [entry.id]: true }), {})
      );
      console.log("All items expanded for PDF generation");

      // Wait for state update and DOM rendering
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Waiting for DOM update complete");

      if (!pdfRef.current) {
        console.error("PDF container reference is null");
        throw new Error("PDF container reference is null");
      }
      console.log("PDF reference element found");

      // Add a temporary class to use basic colors instead of oklch
      document.body.classList.add("pdf-export-mode");
      console.log("Added PDF export mode class to body");

      // Wait for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Create PDF with a specific page size and margins
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          putOnlyUsedFonts: true,
          floatPrecision: 16,
        });

        // Add a colored background to the entire PDF page (including margins)
        pdf.setFillColor(17, 24, 39); // RGB values for #111827
        pdf.rect(
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight(),
          "F"
        );
        console.log("Created jsPDF instance with background color");

        const container = pdfRef.current;

        // Generate canvas with simplified options
        console.log("Starting html2canvas conversion...");
        const canvas = await html2canvas(container, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#111827", // Dark background matching the UI
          // backgroundColor: "#ffffff",
          logging: false,
          ignoreElements: (element) => {
            return element.classList.contains("no-print");
          },
          onclone: (clonedDoc) => {
            // Additional fixes for the cloned document
            const clonedBody = clonedDoc.body;
            clonedBody.classList.add("pdf-export-mode");

            // Apply consistent styling to payment cards
            const cards = clonedBody.querySelectorAll(".payment-card");
            cards.forEach((card) => {
              card.style.backgroundColor = "rgba(17, 24, 39, 0.8)";
              card.style.borderColor = "rgba(55, 65, 81, 0.5)";
              card.style.color = "#d1d5db";
            });

            // Remove any remaining problematic CSS properties
            const elements = clonedBody.querySelectorAll("*");
            elements.forEach((el) => {
              const style = window.getComputedStyle(el);
              Object.keys(style).forEach((key) => {
                if (style[key] && style[key].includes("oklch")) {
                  el.style[key] = "inherit";
                }
              });
            });
          },
        });
        console.log("html2canvas conversion complete");

        // Get dimensions with margins
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Define margins (in mm)
        const margin = {
          top: 15,
          right: 15,
          bottom: -15,
          left: 15,
        };

        const contentWidth = pageWidth - margin.left - margin.right;
        const contentHeight = pageHeight - margin.top - margin.bottom;

        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF with margins
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          margin.left,
          margin.top,
          imgWidth,
          imgHeight
        );

        // If content is too tall, add more pages with proper margins
        let heightLeft = imgHeight;
        let position = 0;
        heightLeft -= contentHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          // Add background color to the new page too
          pdf.setFillColor(17, 24, 39); // RGB values for #111827
          pdf.rect(
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight(),
            "F"
          );
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            margin.left,
            margin.top + position,
            imgWidth,
            imgHeight
          );
          heightLeft -= contentHeight;
        }

        // Save the PDF
        pdf.save(`${group.name}_payment_history.pdf`);
        toast.success("PDF export completed successfully");
      } catch (innerError) {
        console.error("Inner error during PDF generation:", innerError);
        toast.error(`Failed to generate PDF: ${innerError.message}`);
        throw innerError;
      }
    } catch (outerError) {
      console.error("Outer error exporting PDF:", outerError);
      toast.error(`Failed to export PDF: ${outerError.message}`);
    } finally {
      console.log("Cleaning up...");
      document.body.classList.remove("pdf-export-mode");
      setExpandedItems(originalExpandedState || {});
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
                    <h3 className="mb-3 font-medium text-purple-400">
                      Expense per person:{" "}
                      <span className="text-gray-300">
                        ₹
                        {(item.totalAmt?.toFixed(2) ||
                          item.amount?.toFixed(2)) / item.payers?.length}
                      </span>
                    </h3>

                    <div className="flex items-start space-x-12">
                      {item.type == "expense" ? (
                        // type expense
                        <div className="flex-1">
                          <h4 className="mb-3 font-medium text-teal-400">
                            Participants
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
                                  className={`font-medium ${payer.paidAmt == 0 ? "text-gray-300" : "text-red-500/90"}`}
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
                            <h4 className="mb-3 font-medium text-teal-400">
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
                              <span className="font-medium text-red-500/90">
                                ₹{item.amount?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* creditor */}
                          <div>
                            <h4 className="mb-3 font-medium text-teal-400">
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
                        <h4 className="mb-3 font-medium text-teal-400">
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
                                <span className="font-medium text-red-500/90">
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
