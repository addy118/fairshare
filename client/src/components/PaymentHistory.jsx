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
import { selectCurrentGroup } from "@/redux/groupSlice";
import { useGetGroupHistoryQuery } from "@/redux/api";
import { useParams } from "react-router-dom";
import api from "@/axiosInstance";

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

    const htmlContent = pdfRef.current.innerHTML;

    // const cssResponse = await fetch("/index.css");
    // const cssContent = await cssResponse.text();
    // 4. (NEW) Dynamically get all CSS
    let cssContent = "";
    try {
      // 4a. Get all <link rel="stylesheet"> tags
      const stylesheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      );

      // 4b. Filter for local stylesheets (ignore external ones like Google Fonts)
      const localStylesheets = stylesheets.filter(
        (link) => link.href && !link.href.startsWith("http")
      );

      // 4c. Fetch the text content of each local stylesheet
      const cssPromises = localStylesheets.map((link) =>
        fetch(link.href).then((res) => res.text())
      );

      // 4d. Wait for all fetches and join them
      const cssStrings = await Promise.all(cssPromises);
      cssContent = cssStrings.join("\n\n");
    } catch (error) {
      console.error("Could not fetch CSS:", error);
    }

    // 5. (NEW) Get all <style> tag content (for CSS-in-JS like Styled-Components)
    const styleTags = Array.from(document.querySelectorAll("style"));
    const styleContent = styleTags.map((style) => style.innerHTML).join("\n\n");

    // 6. Combine all CSS
    const combinedCss = cssContent + "\n\n" + styleContent;

    try {
      const response = await api.post(
        `/grp/${groupId}/history/export`,
        {
          groupId,
          html: htmlContent,
          css: combinedCss,
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      console.log(`Sent req to /grp/${groupId}/history/export`);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "payment-history.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting PDF: ", err);

      if (err.response && err.response.data.toString() === "[object Blob]") {
        // the error response is a blob, let's read it as text
        const errorData = await err.response.data.text();
        try {
          const errorJson = JSON.parse(errorData);
          console.error("Server-side error message:", errorJson.message);
          // here you can set an error toast: toast.error(errorJson.message)
        } catch (e) {
          console.error("Could not parse error blob:", errorData);
        }
      } else if (err.response) {
        // it's a regular json error
        console.error("Server-side error message:", err.response.data.message);
      } else {
        // this is the "Network Error"
        console.error("Network Error, check server or CORS:", err.message);
      }
    } finally {
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
              className="h-8 flex-1 rounded-sm border-gray-700 text-xs hover:bg-gray-700/70 hover:text-[#00bcff] sm:h-10 sm:flex-auto sm:text-sm md:flex-auto"
            >
              Toggle All
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-8 flex-1 rounded-sm border-gray-700 text-xs hover:bg-gray-700/70 hover:text-[#00bcff] sm:h-10 sm:flex-auto sm:text-sm md:flex-auto"
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
                      <span className="mr-2 text-sm font-bold text-[#00bcff] sm:text-base">
                        ₹{item.totalAmt?.toFixed(2) || item.amount?.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="no-print h-6 w-6 p-0 hover:text-[#00bcff] sm:h-8 sm:w-8"
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
                          <h4 className="mb-3 text-sm font-medium text-[#00bcff] sm:text-base">
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
                            <h4 className="mb-2 text-sm font-medium text-[#00bcff] sm:mb-3 sm:text-base">
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
                            <h4 className="mb-2 text-sm font-medium text-[#00bcff] sm:mb-3 sm:text-base">
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
                        <h4 className="mb-2 text-sm font-medium text-[#00bcff] sm:mb-3 sm:text-base">
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
