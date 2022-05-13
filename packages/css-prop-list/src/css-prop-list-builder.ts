/**
 * This script is a tool for building and compressing the source of __css_prop_list__ (`known-css-props.ts`).
 * 
 * This script __is_not_exported__ to this package entry point,
 * so it wouldn't affected to client's project performance.
 * 
 * -== just a script for making a script ==-
 * The final script is `css-prop-list.ts` => `css-prop-list.js`
 */



// internals:
import {
    knownCssProps,
}                           from './known-css-props.js'



// sort the list:
const sortedKnownCssProps = knownCssProps.slice(0).sort();



// remove the duplicates:
const uniqueSortedKnownCssProps = Array.from(new Set(sortedKnownCssProps));



//#region utilities
const isUppercase  = (test: string) => (test >= 'A') && (test <= 'Z');

type WordAccum = {
    words  : string[]
    buffer : string[]
}
const wordSplitter = (accum: WordAccum, char: string): WordAccum => {
    if (!isUppercase(char)) {
        accum.buffer.push(char);
    }
    else {
        if (accum.buffer.length) {
            accum.words.push(
                accum.buffer.join('')
            );
        } // if
        
        accum.buffer = [char]; // reset to beginning
    } // if
    
    return accum;
};
const splitWord = (word: string): string[] => {
    const accum = Array.from(word).reduce(wordSplitter, { words: [], buffer: [] });
    if (accum.buffer.length) {
        accum.words.push(
            accum.buffer.join('')
        );
    } // if
    
    // verify the result:
    if (accum.words.join('') !== word) throw Error('invalid algorithm');
    
    return accum.words;
};
//#endregion utilities



// compress the list:

const wordSet = new Set<string>();
const indexedKnownCssProps : number[][] = [];

for (const prop of uniqueSortedKnownCssProps) {
    const subWords = splitWord(prop);
    subWords.forEach((subWord) => wordSet.add(subWord));
    
    const wordList = Array.from(wordSet);
    const indexedSubWords = subWords.map((subWord) => wordList.indexOf(subWord));
    indexedKnownCssProps.push(indexedSubWords);
} // for

const wordList = Array.from(wordSet);



// verify the result:
for (let i = 0; i < uniqueSortedKnownCssProps.length; i++) {
    const word1 = uniqueSortedKnownCssProps[i];
    const word2 = indexedKnownCssProps[i].map((wordIndex) => wordList[wordIndex]).join('');
    if (word1 !== word2) throw Error('invalid algorithm');
} // for



// show the result:
console.log(wordList);
console.log(indexedKnownCssProps);
console.log('succcess. Please copy the results above to your script!');
debugger;
