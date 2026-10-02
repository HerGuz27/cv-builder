import React, { useState } from "react";
import { CVBuilder } from "../components/CVGenerator/CVBuilder";
import { readDraft } from "../hooks/useCVStorage";
import { mockCVData } from "../data/mockCV";

export const CVBuilderPage: React.FC = () => {
  // Se lee una sola vez, al montar: a partir de ahí manda el estado del editor.
  const [initialData] = useState(() => readDraft() ?? mockCVData);

  return <CVBuilder data={initialData} />;
};
