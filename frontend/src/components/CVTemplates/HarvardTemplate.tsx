import React from "react";
import { CVData } from "../../types/cv";
import { CVTemplateContent } from "./CVTemplateContent";

interface HarvardTemplateProps {
  data: CVData;
}

export const HarvardTemplate: React.FC<HarvardTemplateProps> = ({ data }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ backgroundColor: "#ffffff", width: "8.5in" }}>
        <CVTemplateContent data={data} />
      </div>
    </div>
  );
};
