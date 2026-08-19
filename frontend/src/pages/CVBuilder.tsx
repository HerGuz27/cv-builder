import React from "react";
import { CVBuilder } from "../components/CVGenerator/CVBuilder";
import { mockCVData } from "../data/mockCV";

export const CVBuilderPage: React.FC = () => {
  return <CVBuilder data={mockCVData} />;
};
