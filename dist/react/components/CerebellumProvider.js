import { jsx as _jsx } from "react/jsx-runtime";
/* The code provided is creating a provider component in a TypeScript React application. Here's a
breakdown of what the code is doing: */
// Create a provider component
import { createContext, useEffect, useState } from "react";
import Cerebellum from "../../cerebellum";
/* The line `export const CerebellumContext = createContext<CerebellumInit | null>(null);` is creating
a context object in React using the `createContext` function from the React library. */
export const CerebellumContext = createContext(null);
/**
 * The `CerebellumProvider` component initializes and provides a Cerebellum instance to its children
 * within a context, handling loading and error states.
 * @param {CerebellumProviderProps}  - The `CerebellumProvider` component is a React component that
 * serves as a provider for the Cerebellum context. It initializes the Cerebellum instance using the
 * provided endpoint and options, and then provides the initialized Cerebellum instance to its children
 * through the `CerebellumContext.Provider` component.
 * @param {string} endpoint - The `endpoint` parameter is a string that represents the URL or address
 * of the Cerebellum service that the component will interact with.
 * @param {CerebellumOptions} options - The `options` parameter is an object that contains configuration
 * options for the Cerebellum service. It includes properties such as `auth`, `API_KEY`, and `autoConnect`.
 * @param {React.JSX.Element} children - The `children` parameter is a React element that represents the
 * child components that will be rendered within the `CerebellumProvider` component.
 * @returns The `CerebellumProvider` component is returning either `null` if it is still loading, or it
 * is returning a `CerebellumContext.Provider` component with the `cerebellum` value provided to its
 * children.
 */
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