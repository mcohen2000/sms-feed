export function countCharacters(str: String) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        count += 2;
      }
      if (str[i] !== "\n") {
        count++;
      }
    }
    return count;
}