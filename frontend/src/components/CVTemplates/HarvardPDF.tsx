import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CVData } from "../../types/cv";
import { CVTemplateContent } from "./CVTemplateContent";

interface HarvardPDFProps {
  data: CVData;
}

export const HarvardPDF: React.FC<HarvardPDFProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generatePDF = async () => {
      if (!containerRef.current) return;

      try {
        const canvas = await html2canvas(containerRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`cv-${data.personal.nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    generatePDF();
  }, [data]);

  return (
    <div ref={containerRef} style={{ display: "none" }}>
      <div
        style={{
          width: "8.5in",
          height: "11in",
          margin: 0,
          padding: 0,
          backgroundColor: "white",
        }}
      >
        <CVTemplateContent data={data} />
      </div>
    </div>
  );
};
