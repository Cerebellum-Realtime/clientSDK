import { CerebellumOptions } from "../../types";
import { CerebellumInit } from "../../CerebellumInit";
export declare const CerebellumContext: import("react").Context<CerebellumInit | null>;
interface CerebellumProviderProps {
    endpoint: string;
    options: CerebellumOptions;
    children: React.JSX.Element;
}
export declare const CerebellumProvider: ({ children, endpoint, options, }: CerebellumProviderProps) => import("react/jsx-runtime").JSX.Element | null;
export default CerebellumProvider;
