import {
    generateId,
} from '../dist/utilities.js'



//#region test generateId()
const testSheetIds = [
    'sheet-1',
    'sheet-2',
    'sheet-3',
    'sheet-4',
    'sheet-5',
    'sheet-6',
    'sheet-7',
    'sheet-8',
    'sheet-9',
    'sheet-10',
];
const testScopeNames = [
    'scope1',
    'scope2',
    'scope3',
    'scope4',
    'scope5',
    'scope6',
    'scope7',
    'scope8',
    'scope9',
    'scope10',
];
test(`generateId()`, () => {
    const ids = testSheetIds.flatMap((testSheetId) =>
        testScopeNames.map((testScopeName) =>
            generateId(testSheetId, testScopeName)
        )
    );
    
    expect(Array.from(new Set<string>(ids)))
    .toEqual(
        ids
    );
    
    const ids2 = testSheetIds.slice(0).reverse().flatMap((testSheetId) =>
        testScopeNames.slice(0).reverse().map((testScopeName) =>
            generateId(testSheetId, testScopeName)
        )
    ).slice(0).reverse();
    
    expect(ids2)
    .toEqual(
        ids
    );
});
//#endregion test generateId()
