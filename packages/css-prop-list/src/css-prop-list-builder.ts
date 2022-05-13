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

// collect the words:
const wordStatistic = new Map<string, number>();
for (const prop of uniqueSortedKnownCssProps) {
    const subWords = splitWord(prop);
    
    subWords.forEach((subWord) => {
        const counter = (wordStatistic.get(subWord) ?? 0) + 1;
        wordStatistic.set(subWord, counter);
    });
} // for



// sort the words by frequency, from most frequent to most rare:
const sortedWordList = (
    Array.from(wordStatistic.entries())
    .sort((a, b) => b[1] - a[1])
    .map((entry): string => entry[0])
);
const encodedSortedWordList = sortedWordList.join(',');
const decodedSortedWordList = encodedSortedWordList.split(',')



// indexing the words:
const prevWordIndexMap = new Map<number, number>();
const indexedKnownCssProps : (number|null)[][] = [];
for (const prop of uniqueSortedKnownCssProps) {
    const subWords = splitWord(prop);
    
    const indexedSubWords = (
        subWords
        .map((subWord, index): number|null => {
            const wordIndex = decodedSortedWordList.indexOf(subWord);
            
            const prevWordIndex = prevWordIndexMap.get(index);
            if (prevWordIndex !== undefined) {
                if (wordIndex === prevWordIndex) return null; // null means: same as previous index
            } // if
            prevWordIndexMap.set(index, wordIndex);
            
            return wordIndex;
        })
    );
    
    indexedKnownCssProps.push(indexedSubWords);
} // for



// verify the result:
const prevWordIndexMap2 = new Map<number, number>();
for (let i = 0; i < uniqueSortedKnownCssProps.length; i++) {
    const word1 = uniqueSortedKnownCssProps[i];
    
    const word2 = indexedKnownCssProps[i].map((wordIndex, index): string => {
        if (wordIndex === null) {
            wordIndex = prevWordIndexMap2.get(index) ?? 0;
        }
        else {
            prevWordIndexMap2.set(index, wordIndex);
        } // if
        
        return decodedSortedWordList[wordIndex];
    }).join('');
    
    if (word1 !== word2) throw Error('invalid algorithm');
} // for



// show the result:
console.log(encodedSortedWordList);
console.log(indexedKnownCssProps);
console.log('succcess. Please copy the results above to your script!');
debugger;
