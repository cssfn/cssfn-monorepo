import type { OptionalOrBoolean, SingleOrArray, SingleOrDeepArray } from '@cssfn/types';
export declare type ParentSelectorToken = '&';
export declare type UniversalSelectorToken = '*';
export declare type UnnamedSelectorToken = ParentSelectorToken | UniversalSelectorToken;
export declare type AttrSelectorToken = '[';
export declare type ElementSelectorToken = '';
export declare type IdSelectorToken = '#';
export declare type ClassSelectorToken = '.';
export declare type PseudoClassSelectorToken = ':';
export declare type PseudoElementSelectorToken = '::';
export declare type NamedSelectorToken = ElementSelectorToken | IdSelectorToken | ClassSelectorToken | PseudoClassSelectorToken | PseudoElementSelectorToken;
export declare type SelectorToken = UnnamedSelectorToken | AttrSelectorToken | NamedSelectorToken;
export declare type SelectorName = string & {};
export declare type AttrSelectorName = string & {};
export declare type AttrSelectorOperator = '=' | '~=' | '|=' | '^=' | '$=' | '*=';
export declare type AttrSelectorValue = string & {};
export declare type AttrSelectorOptions = 'i' | 'I' | 's' | 'S';
export declare type AttrSelectorParams = readonly [AttrSelectorName] | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue] | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions];
export declare type WildParams = string & {};
export declare type SelectorParams = AttrSelectorParams | SelectorGroup | WildParams;
export declare type PseudoClassSelectorParams = Exclude<SelectorParams, AttrSelectorParams>;
export declare type ParentSelector = readonly [ParentSelectorToken];
export declare type UniversalSelector = readonly [UniversalSelectorToken];
export declare type UnnamedSelector = ParentSelector | UniversalSelector;
export declare type AttrSelector = readonly [AttrSelectorToken, null, AttrSelectorParams];
export declare type ElementSelector = readonly [ElementSelectorToken, SelectorName];
export declare type IdSelector = readonly [IdSelectorToken, SelectorName];
export declare type ClassSelector = readonly [ClassSelectorToken, SelectorName];
export declare type PseudoClassSelector = readonly [PseudoClassSelectorToken, SelectorName] | readonly [PseudoClassSelectorToken, SelectorName, PseudoClassSelectorParams];
export declare type PseudoElementSelector = readonly [PseudoElementSelectorToken, SelectorName];
export declare type NamedSelector = ElementSelector | IdSelector | ClassSelector | PseudoClassSelector | PseudoElementSelector;
export declare type SimpleSelector = UnnamedSelector | AttrSelector | NamedSelector;
export declare type DescendantCombinator = ' ';
export declare type ChildCombinator = '>';
export declare type SiblingCombinator = '~';
export declare type NextSiblingCombinator = '+';
export declare type Combinator = DescendantCombinator | ChildCombinator | SiblingCombinator | NextSiblingCombinator;
export declare type SelectorEntry = SimpleSelector | Combinator;
export declare type Selector = OptionalOrBoolean<SelectorEntry>[];
export declare type SelectorGroup = OptionalOrBoolean<Selector>[];
export declare type PureSelector = SelectorEntry[];
export declare type PureSelectorGroup = Selector[];
export declare const parseSelectors: (expressions: SingleOrDeepArray<OptionalOrBoolean<string>>) => SelectorGroup | null;
export declare const isWildParams: (selectorParams: SelectorParams) => selectorParams is WildParams;
export declare const isAttrSelectorParams: (selectorParams: SelectorParams) => selectorParams is AttrSelectorParams;
export declare const isSelectors: (selectorParams: SelectorParams) => selectorParams is SelectorGroup;
export declare const parentSelector: () => ParentSelector;
export declare const universalSelector: () => UniversalSelector;
export declare const attrSelector: (name: AttrSelectorName, operator?: AttrSelectorOperator | undefined, value?: AttrSelectorValue | undefined, options?: AttrSelectorOptions | undefined) => AttrSelector;
export declare const elementSelector: (elmName: SelectorName) => ElementSelector;
export declare const idSelector: (id: SelectorName) => IdSelector;
export declare const classSelector: (className: SelectorName) => ClassSelector;
export declare const pseudoClassSelector: (className: SelectorName, params?: PseudoClassSelectorParams | undefined) => PseudoClassSelector;
export declare const pseudoElementSelector: (elmName: SelectorName) => PseudoElementSelector;
export { parentSelector as createParentSelector, universalSelector as createUniversalSelector, attrSelector as createAttrSelector, elementSelector as createElementSelector, idSelector as createIdSelector, classSelector as createClassSelector, pseudoClassSelector as createPseudoClassSelector, pseudoElementSelector as createPseudoElementSelector, };
export declare const isSimpleSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is SimpleSelector;
export declare const isParentSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is ParentSelector;
export declare const isUniversalSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is UniversalSelector;
export declare const isAttrSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is AttrSelector;
export declare const isElementSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is ElementSelector;
export declare const isIdSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is IdSelector;
export declare const isClassSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is ClassSelector;
export declare const isPseudoClassSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is PseudoClassSelector;
export declare const isClassOrPseudoClassSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is ClassSelector | PseudoClassSelector;
export declare const isPseudoElementSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is PseudoElementSelector;
export declare const isElementOrPseudoElementSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is ElementSelector | PseudoElementSelector;
export declare const isNotSimpleSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotParentSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotUniversalSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotAttrSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotElementSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotIdSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotClassSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotPseudoClassSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotClassOrPseudoClassSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotPseudoElementSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isNotElementOrPseudoElementSelector: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => boolean;
export declare const isAttrSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, attrName: SingleOrArray<string>) => boolean;
export declare const isElementSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName: SingleOrArray<string>) => boolean;
export declare const isIdSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, id: SingleOrArray<string>) => boolean;
export declare const isClassSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, className: SingleOrArray<string>) => boolean;
export declare const isPseudoClassSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, className: SingleOrArray<string>) => boolean;
export declare const isClassOrPseudoClassSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, className: SingleOrArray<string>) => boolean;
export declare const isPseudoElementSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName: SingleOrArray<string>) => boolean;
export declare const isElementOrPseudoElementSelectorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName: SingleOrArray<string>) => boolean;
export declare const combinator: (combinator: Combinator) => Combinator;
export { combinator as createCombinator, };
export declare const isCombinator: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is Combinator;
export declare const isCombinatorOf: (selectorEntry: OptionalOrBoolean<SelectorEntry>, combinator: SingleOrArray<Combinator>) => boolean;
export declare const selector: <TSelector extends Selector = Selector>(...selectorEntries: TSelector) => TSelector;
export declare const pureSelector: <TPureSelector extends PureSelector = PureSelector>(...selectorEntries: TPureSelector) => TPureSelector;
export declare const selectorGroup: <TSelectorGroup extends SelectorGroup = SelectorGroup>(...selectors: TSelectorGroup) => TSelectorGroup;
export declare const pureSelectorGroup: <TPureSelectorGroup extends PureSelectorGroup = PureSelectorGroup>(...selectors: TPureSelectorGroup) => TPureSelectorGroup;
export { selector as createSelector, pureSelector as createPureSelector, selectorGroup as createSelectorGroup, pureSelectorGroup as createPureSelectorGroup, };
export declare const isNotEmptySelectorEntry: (selectorEntry: OptionalOrBoolean<SelectorEntry>) => selectorEntry is SelectorEntry;
export declare const isSelector: (test: OptionalOrBoolean<SelectorEntry | Selector>) => test is Selector;
export declare const isNotEmptySelector: (selector: OptionalOrBoolean<Selector>) => selector is PureSelector;
export declare const isNotEmptySelectors: (selectors: OptionalOrBoolean<SelectorGroup>) => selectors is PureSelectorGroup;
export declare const countSelectorEntries: (selector: OptionalOrBoolean<Selector>) => number;
export declare const countSelectors: (selectors: OptionalOrBoolean<SelectorGroup>) => number;
export declare const selectorParamsToString: (selectorParams: SelectorParams) => string;
export declare const selectorToString: (selector: Selector) => string;
export declare const selectorsToString: (selectors: SelectorGroup) => string;
export declare type ReplaceSelectorsCallback = (selectorEntry: SelectorEntry) => OptionalOrBoolean<SelectorEntry | Selector>;
/**
 * Creates a new `SelectorGroup` populated with the results of calling a provided `callbackFn` on every `SelectorEntry` in the `selectors`.
 * The nested `SelectorEntry` (if any) will also be passed to `callbackFn`.
 * @param selectors The input `SelectorGroup`.
 * @param callbackFn A function that is called for every `SelectorEntry` in the `selectors`.
 * Each time `callbackFn` executes, the returned value is added to the output `SelectorGroup`.
 * @returns The output `SelectorGroup`.
 */
export declare const replaceSelectors: (selectors: SelectorGroup, callbackFn: ReplaceSelectorsCallback) => SelectorGroup;
export interface GroupSelectorOptions {
    selectorName?: SelectorName | ('is' | 'not' | 'has' | 'where');
    cancelGroupIfSingular?: boolean;
}
export declare const groupSelectors: (selectors: OptionalOrBoolean<SelectorGroup>, options?: GroupSelectorOptions) => PureSelectorGroup & {
    0: Selector;
};
export declare const groupSelector: (selector: OptionalOrBoolean<Selector>, options?: GroupSelectorOptions) => PureSelectorGroup & {
    0: Selector;
};
export interface UngroupSelectorOptions {
    selectorName?: SelectorName[] & ('is' | 'not' | 'has' | 'where')[];
}
export declare const ungroupSelector: (selector: OptionalOrBoolean<Selector>, options?: UngroupSelectorOptions) => PureSelectorGroup;
export declare const ungroupSelectors: (selectors: OptionalOrBoolean<SelectorGroup>, options?: UngroupSelectorOptions) => PureSelectorGroup;
export declare type Specificity = [number, number, number];
export declare const calculateSpecificity: (selector: Selector) => Specificity;
