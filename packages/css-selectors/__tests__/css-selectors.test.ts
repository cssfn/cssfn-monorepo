import {
    parseSelectors,
} from '../src/css-selectors'



test(`parseSelectors('')`, () => {
    expect(parseSelectors(''))
    .toEqual([])
});
test(`parseSelectors(false)`, () => {
    expect(parseSelectors(false))
    .toEqual([])
});
test(`parseSelectors(true)`, () => {
    expect(parseSelectors(true))
    .toEqual([])
});

test(`parseSelectors([''])`, () => {
    expect(parseSelectors(['']))
    .toEqual([])
});
test(`parseSelectors([false])`, () => {
    expect(parseSelectors([false]))
    .toEqual([])
});
test(`parseSelectors([true])`, () => {
    expect(parseSelectors([true]))
    .toEqual([])
});