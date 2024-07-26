// Create a provider component
import { createContext, useEffect, useState } from "react";
import Cerebellum from "../../cerebellum";
import { CerebellumOptions } from "../../types";
import { CerebellumInit } from "../../CerebellumInit";

export const CerebellumContext = createContext<CerebellumInit | null>(null);

interface CerebellumProviderProps {
  endpoint: string;
  options: CerebellumOptions;
  children: React.JSX.Element;
}
export const CerebellumProvider = ({
  children,
  endpoint,
  options,
}: CerebellumProviderProps) => {
  const [cerebellum, setCerebellum] = useState<CerebellumInit | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeCerebellum = async () => {
      try {
        const cerebellumInstance = await Cerebellum(endpoint, options);
        setCerebellum(cerebellumInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize Cerebellum", error);
        setIsLoading(false);
      }
    };

    initializeCerebellum();
  }, [endpoint, options]);

  if (isLoading) {
    return null;
  }

  if (cerebellum === null) {
    throw new Error("Cerebellum not initialized");
  } else {
    return (
      <CerebellumContext.Provider value={cerebellum}>
        {children}
      </CerebellumContext.Provider>
    );
  }
};

export default CerebellumProvider;
