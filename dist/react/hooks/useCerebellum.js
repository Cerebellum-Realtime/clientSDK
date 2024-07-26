// useCerebellum.js
import { useContext } from "react";
import { CerebellumContext } from "../components/CerebellumProvider";
export function useCerebellum() {
    const context = useContext(CerebellumContext);
    if (context === null) {
        throw new Error("useCerebellum must be used within a CerebellumProvider");
    }
    return context;
}
export default useCerebellum;
//# sourceMappingURL=useCerebellum.js.map