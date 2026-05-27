export default (content) => {
  const imports = [],
    regex = /import\s+['"](\.\.?\/[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
};
