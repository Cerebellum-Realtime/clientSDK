// useCerebellum.js
import { useContext } from "react";
import { CerebellumContext } from "../components/CerebellumProvider";
/**
 * The useCerebellum function is used to access the Cerebellum context within a CerebellumProvider in
 * TypeScript.
 * @returns The `useCerebellum` function returns the `context` obtained from the `CerebellumContext`.
 * If the `context` is `null`, it throws an error indicating that `useCerebellum` must be used within a
 * `CerebellumProvider`.
 */
export function useCerebellum() {
    const context = useContext(CerebellumContext);
    if (context === null) {
        throw new Error("useCerebellum must be used within a CerebellumProvider");
    }
    return context;
}
export default useCerebellum;
//# sourceMappingURL=useCerebellum.js.map