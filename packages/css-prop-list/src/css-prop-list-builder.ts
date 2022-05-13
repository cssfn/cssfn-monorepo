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
    else if (accum.buffer.length) {
        accum.words.push(
            accum.buffer.join('')
        );
        accum.buffer = []; // clear
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



// show the result:
console.log(wordList);
console.log(indexedKnownCssProps);
debugger;
