import {
    // Lazy resolutions:
    type MaybeLazyDeferred,
}                           from '@cssfn/types';

// Extreme test cases:
const tests: MaybeLazyDeferred<number>[] = [
    // Simple resolved number:
    42,

    // Promise resolving to number:
    Promise.resolve(42),

    // Function returning number:
    () => 42,

    // Function returning Promise<number>:
    () => Promise.resolve(42),

    // Deeply nested async Promise chain:
    async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    new Promise((innerResolve) => {
                        setTimeout(() => innerResolve(42), 500);
                    })
                );
            }, 500);
        });
    },

    // Extremely delayed async Promise:
    async () => new Promise((resolve) => setTimeout(() => resolve(42), 2000)),

    // Lazy function returning a Promise resolving another Promise:
    async () => {
        return Promise.resolve(Promise.resolve(Promise.resolve(Promise.resolve(Promise.resolve(42)))));
    },

    // Function throwing an error (to test error handling):
    () => {
        throw new Error("Intentional Test Error");
    },

    // Async function rejecting a Promise:
    async () => {
        return Promise.reject(new Error("Rejected Promise Test"));
    }
];

// Extract direct values or module-wrapped defaults:
const extractScopeList = (scopeSource: Exclude<MaybeLazyDeferred<number>, Function | Promise<any>>): number => {
    if (!scopeSource || (typeof scopeSource !== 'object') || !('default' in scopeSource)) return scopeSource;
    return scopeSource.default;
};

// Resolves a deferred scope list before extracting values:
const resolveDeferredScopeList = async (scopeSource: Exclude<MaybeLazyDeferred<number>, Function>): Promise<number> => {
    if (!(scopeSource instanceof Promise)) return extractScopeList(scopeSource);

    const awaitedScopeSource = await scopeSource;
    return extractScopeList(awaitedScopeSource);
};

// Fully resolves any lazy or deferred number value:
const resolveScopeList = async (scopeSource: MaybeLazyDeferred<number>): Promise<number> => {
    if (typeof scopeSource !== 'function') return resolveDeferredScopeList(scopeSource);

    try {
        const resolvedScope = scopeSource();
        if (!(resolvedScope instanceof Promise)) return extractScopeList(resolvedScope);

        const awaitedScopeSource = await resolvedScope;
        return extractScopeList(awaitedScopeSource);
    } catch (error) {
        console.error("Error resolving scope list:", error);
        return NaN; // Return NaN for failed resolutions
    }
};

// Running tests:
console.time("Resolve Extreme Cases");

for (const [index, test] of tests.entries()) {
    try {
        const result = await resolveScopeList(test);
        console.log(`Test ${index + 1}:`, result);
    } catch (error) {
        console.error(`Test ${index + 1} failed:`, error);
    }
}

console.timeEnd("Resolve Extreme Cases");
