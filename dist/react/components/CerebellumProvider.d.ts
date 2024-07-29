import { CerebellumOptions } from "../../types";
import { CerebellumInit } from "../../CerebellumInit";
export declare const CerebellumContext: import("react").Context<CerebellumInit | null>;
interface CerebellumProviderProps {
    endpoint: string;
    options: CerebellumOptions;
    children: React.JSX.Element;
}
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
export declare const CerebellumProvider: ({ children, endpoint, options, }: CerebellumProviderProps) => import("react/jsx-runtime").JSX.Element | null;
export default CerebellumProvider;
