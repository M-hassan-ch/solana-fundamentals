export function convertStringToArray(input: string): number[] {
    const trimmedInput = input.trim().replace(/^\[|\]$/g, "");
    const numberArray = trimmedInput.split(",").map((numStr) => parseInt(numStr.trim(), 10));
    return numberArray.filter((num) => !isNaN(num));
}
