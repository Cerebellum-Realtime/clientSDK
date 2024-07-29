/**
 * The useCerebellum function is used to access the Cerebellum context within a CerebellumProvider in
 * TypeScript.
 * @returns The `useCerebellum` function returns the `context` obtained from the `CerebellumContext`.
 * If the `context` is `null`, it throws an error indicating that `useCerebellum` must be used within a
 * `CerebellumProvider`.
 */
export declare function useCerebellum(): import("../../CerebellumInit").CerebellumInit;
export default useCerebellum;
