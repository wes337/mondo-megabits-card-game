export const generateKey = (length = 5): string => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const hyphenToCamelCase = (hyphenString) => {
  return hyphenString.replace(/-([a-z])/g, (g) => {
    return g[1].toUpperCase();
  });
};
