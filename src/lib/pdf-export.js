import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function withTimeout(promise, timeout = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("html2canvas timed out")), timeout)
    ),
  ]);
}

export const toPDF = async (element, options = {}) => {
  if (!element) {
    console.log("no element");
    throw new Error("Element to export not provided");
  }

  const { filename = "download.pdf", page = {} } = options;

  const pageSettings = {
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    format: "a4",
    orientation: "portrait",
    ...page,
  };

  try {
    console.log("pdf export 24");

    const clone = element.cloneNode(true);

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.opacity = "0";
    container.style.zIndex = "-1";
    container.style.width = "210mm";
    container.style.padding = `${pageSettings.marginTop}mm ${pageSettings.marginRight}mm ${pageSettings.marginBottom}mm ${pageSettings.marginLeft}mm`;
    container.appendChild(clone);
    document.body.appendChild(container);

    const expandButtons = clone.querySelectorAll("button");
    expandButtons.forEach((button) => {
      if (button.classList.contains("no-print")) {
        button.style.display = "none";
      }
    });

    const cards = clone.querySelectorAll(".payment-card");
    cards.forEach((card) => {
      const content = card.querySelector('div[class*="CardContent"]');
      if (content) {
        content.style.display = "block";
      }
    });

    const flexContainers = clone.querySelectorAll(".pdf-flex-row");
    flexContainers.forEach((container) => {
      container.style.display = "flex";
      container.style.flexDirection = "row";
      container.style.justifyContent = "space-between";
      container.style.gap = "20px";

      const sections = container.querySelectorAll(".pdf-flex-item");
      sections.forEach((section) => {
        section.style.flex = "1";
      });
    });

    console.log("waiting for fonts");
    await document.fonts.ready;

    console.log("waiting for images");
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
        }
      })
    );

    console.log("line 71");
    console.log(container);

    const canvas = await withTimeout(
      html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      }),
      10000
    );

    console.log("line 80");

    document.body.removeChild(container);

    const imgWidth = 210 - (pageSettings.marginLeft + pageSettings.marginRight);
    const pageHeight =
      297 - (pageSettings.marginTop + pageSettings.marginBottom);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    console.log("creating pdf...");

    const pdf = new jsPDF({
      orientation: pageSettings.orientation,
      unit: "mm",
      format: pageSettings.format,
    });

    console.log("pdf created at 97");

    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;

    while (heightLeft > 0) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const heightToDraw = Math.min(pageHeight, heightLeft);

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        pageSettings.marginLeft,
        pageSettings.marginTop + position,
        imgWidth,
        imgHeight,
        null,
        "FAST",
        0
      );

      heightLeft -= pageHeight;
      position -= pageHeight;
      pageCount++;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
