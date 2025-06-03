import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import formatDate from "@/utils/formatDate";
import Loading from "./Loading";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentGroup } from "@/store/slices/groupSlice";
import { useGetGroupHistoryQuery } from "@/store/api/apiSlice";
import { useParams } from "react-router-dom";

export default function PaymentHistory() {
  const { id: groupId } = useParams();
  const group = useSelector(selectCurrentGroup);
  const [expandedItems, setExpandedItems] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef(null);

  const { data: history = [] } = useGetGroupHistoryQuery(groupId, {
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  const toggleAll = () => {
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

  const handleExport = async () => {
    let originalExpandedState;

    try {
      setIsExporting(true);

      // Save the current expanded state to restore later
      originalExpandedState = { ...expandedItems };

      // Expand all items
      setExpandedItems(
        history.reduce((acc, entry) => ({ ...acc, [entry.id]: true }), {})
      );

      // Wait for state update and DOM rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!pdfRef.current) {
        console.error("PDF container reference is null");
        throw new Error("PDF container reference is null");
      }

      // Add a temporary class to use basic colors instead of oklch
      document.body.classList.add("pdf-export-mode");

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

        const container = pdfRef.current;

        // Generate canvas with simplified options
        const canvas = await html2canvas(container, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#111827", // Dark background matching the UI
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
      document.body.classList.remove("pdf-export-mode");
      setExpandedItems(originalExpandedState || {});
      setIsExporting(false);
    }
  };

  if (!history?.length) {
    return (
      <Card className="glass-dark hover-lift border border-gray-700/50 shadow-lg transition-all duration-300">
        <CardContent className="pt-4 sm:pt-6">
          <p className="text-center text-sm text-gray-300 sm:text-base">
            No payment history available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-dark mx-auto mb-20 max-w-6xl rounded-sm border border-gray-700/50 px-3 shadow-lg sm:px-4">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 sm:space-y-2">
            <CardTitle className="gradient-text text-lg sm:text-xl">
              Payments History
            </CardTitle>
            <CardDescription className="text-sm text-gray-300 sm:text-base">{`All payments in the group ${group.name}`}</CardDescription>
          </div>

          <div className="flex w-full flex-row items-center gap-2 md:w-auto">
            <Button
              variant="outline"
              onClick={toggleAll}
              className="h-8 flex-1 rounded-sm border-gray-700 text-xs hover:bg-gray-700/70 hover:text-teal-400 sm:h-10 sm:flex-auto sm:text-sm md:flex-auto"
            >
              Toggle All
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-8 flex-1 rounded-sm border-gray-700 text-xs hover:bg-gray-700/70 hover:text-teal-400 sm:h-10 sm:flex-auto sm:text-sm md:flex-auto"
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
          <div
            ref={pdfRef}
            className="payment-history-container space-y-3 rounded-sm sm:space-y-4"
          >
            {history?.map((item) => (
              <Card
                key={item.id}
                className="payment-card glass-dark overflow-hidden rounded-sm border border-gray-700/50"
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base text-gray-300 sm:text-lg">
                        {item.name || "Settlement"}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center text-xs text-gray-400 sm:text-sm">
                        {formatDate(item.timestamp)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center">
                      <span className="mr-2 text-sm font-bold text-teal-400 sm:text-base">
                        ₹{item.totalAmt?.toFixed(2) || item.amount?.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="no-print h-6 w-6 p-0 hover:text-teal-400 sm:h-8 sm:w-8"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {expandedItems?.[item.id] ? (
                          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* payment details ( expense / split ) */}
                {expandedItems?.[item.id] && (
                  <CardContent className="pt-0">
                    {item.type == "expense" && (
                      <h3 className="mb-3 text-sm font-medium text-purple-400 sm:text-base">
                        Expense per person:{" "}
                        <span className="text-gray-300">
                          ₹
                          {Math.floor(
                            item.totalAmt?.toFixed(2) / item.payers?.length
                          )}
                        </span>
                      </h3>
                    )}

                    <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-12">
                      {item.type == "expense" ? (
                        // type expense
                        <div className="flex-1">
                          <h4 className="mb-3 text-sm font-medium text-teal-400 sm:text-base">
                            Participants
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {item.payers?.map((payer, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-xs sm:text-sm"
                              >
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <Avatar className="h-5 w-5 border border-gray-700 sm:h-6 sm:w-6">
                                    <AvatarImage
                                      src={
                                        payer.payer?.pfp || "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback className="bg-gray-400 text-xs">
                                      {payer.payer.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
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
                        <div className="flex-1 space-y-4 sm:space-y-6">
                          {/* debitor */}
                          <div>
                            <h4 className="mb-2 text-sm font-medium text-teal-400 sm:mb-3 sm:text-base">
                              Debitor
                            </h4>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2 sm:gap-4">
                                <Avatar className="h-5 w-5 border border-gray-700 sm:h-6 sm:w-6">
                                  <AvatarImage
                                    src={item.debtor?.pfp || "/placeholder.svg"}
                                  />
                                  <AvatarFallback className="bg-gray-400 text-xs">
                                    {item.debtor?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-300">
                                  {item.debtor?.name}
                                </span>
                              </div>
                              <span className="font-medium text-red-500/90">
                                ₹{item.amount?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* creditor */}
                          <div>
                            <h4 className="mb-2 text-sm font-medium text-teal-400 sm:mb-3 sm:text-base">
                              Creditor
                            </h4>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2 sm:gap-4">
                                <Avatar className="h-5 w-5 border border-gray-700 sm:h-6 sm:w-6">
                                  <AvatarImage
                                    src={
                                      item.creditor?.pfp || "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback className="bg-gray-400 text-xs">
                                    {item.creditor?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-300">
                                  {item.creditor?.name}
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
                        <h4 className="mb-2 text-sm font-medium text-teal-400 sm:mb-3 sm:text-base">
                          Balance After This Transaction
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                          {item.balance?.map((balance, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs sm:text-sm"
                            >
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Avatar className="h-5 w-5 border border-gray-700 sm:h-6 sm:w-6">
                                  <AvatarImage
                                    src={balance.user.pfp || "/placeholder.svg"}
                                  />
                                  <AvatarFallback className="bg-gray-400 text-xs">
                                    {balance.user?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
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
