import { jsx as _jsx } from "react/jsx-runtime";
// Create a provider component
import { createContext, useEffect, useState } from "react";
import Cerebellum from "../../cerebellum";
export const CerebellumContext = createContext(null);
// eslint-disable-next-line react/prop-types
export const CerebellumProvider = ({ children, endpoint, options, }) => {
    const [cerebellum, setCerebellum] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const initializeCerebellum = async () => {
            try {
                const cerebellumInstance = await Cerebellum(endpoint, options);
                setCerebellum(cerebellumInstance);
                setIsLoading(false);
            }
            catch (error) {
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
    }
    else {
        return (_jsx(CerebellumContext.Provider, { value: cerebellum, children: children }));
    }
};
export default CerebellumProvider;
//# sourceMappingURL=CerebellumProvider.js.map