export const createBulkList = (list: string[]) => {
    // sort the list:
    const sortedList = list.slice(0).sort();
    
    
    
    // remove the duplicates:
    const uniqueSortedList = Array.from(new Set(sortedList));
    
    
    
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
    for (const item of uniqueSortedList) {
        const subWords = splitWord(item);
        
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
    const decodedSortedWordList = encodedSortedWordList.split(',');
    // verify the decoded:
    for (let i = 0; i < sortedWordList.length; i++) {
        if (sortedWordList[i] !== decodedSortedWordList[i]) throw Error('invalid algorithm');
    } // for
    
    
    
    // indexing the words:
    const indexedList : number[][] = [];
    for (const item of uniqueSortedList) {
        const subWords = splitWord(item);
        
        const indexedSubWords : number[] = (
            subWords
            .map((subWord): number => {
                const wordIndex = decodedSortedWordList.indexOf(subWord);
                
                return wordIndex;
            })
        );
        
        indexedList.push(indexedSubWords);
    } // for
    
    const prevWordIndexMap = new Map<number, number>();
    const compressedIndexedList : (number|null)[][] = (
        indexedList
        .map((subWordIndices): (number|null)[] => (
            subWordIndices
            .map((wordIndex, index): number|null => {
                const prevWordIndex = prevWordIndexMap.get(index);
                if (prevWordIndex !== undefined) {
                    if (wordIndex === prevWordIndex) return null; // null means: same as previous index
                } // if
                prevWordIndexMap.set(index, wordIndex);
                
                return wordIndex;
            })
        ))
    );
    
    const encodedIndexedList = (
        compressedIndexedList
        .map((subWordIndices): string => (
            subWordIndices
            .map((wordIndex) => (
                (wordIndex === null)
                ?
                ''
                :
                wordIndex.toString(36)
            ))
            .join('-')
        ))
        .join(',')
    );
    
    const prevWordIndexMap2 = new Map<number, number>();
    const decodedIndexedList = (
        encodedIndexedList.split(',')
        .map((encodedItem): number[] => (
            encodedItem.split('-')
            .map((encodedWord, index): number => {
                if (encodedWord === '') {
                    return prevWordIndexMap2.get(index) ?? 0;
                }
                else {
                    const wordIndex = Number.parseInt(encodedWord, 36);
                    prevWordIndexMap2.set(index, wordIndex);
                    
                    return wordIndex;
                } // if
            })
        ))
    );
    // verify the decoded:
    for (let i = 0; i < indexedList.length; i++) {
        for (let j = 0; j < indexedList[i].length; j++) {
            if (indexedList[i][j] !== decodedIndexedList[i][j]) throw Error('invalid algorithm');
        } // for
    } // for
    
    
    
    // verify the result:
    const prevWordIndexMap3 = new Map<number, number>();
    for (let i = 0; i < uniqueSortedList.length; i++) {
        const word1 = uniqueSortedList[i];
        
        const word2 = decodedIndexedList[i].map((wordIndex, index): string => {
            if (wordIndex === null) {
                wordIndex = prevWordIndexMap3.get(index) ?? 0;
            }
            else {
                prevWordIndexMap3.set(index, wordIndex);
            } // if
            
            return decodedSortedWordList[wordIndex];
        }).join('');
        
        if (word1 !== word2) throw Error('invalid algorithm');
    } // for
    
    
    
    // the results:
    return {
        encodedSortedWordList,
        encodedIndexedList,
    };
};
