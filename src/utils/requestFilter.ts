export function filterRequest(word: string) {
  const bannedWordsDict: { [key: string]: boolean } = {
    "/robots.txt": true,
    "/wp-login.php": true,
  };
  return bannedWordsDict[word] ?? false;
}
