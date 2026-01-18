export const generateUniqueSlug = (string: string) => {
  const textString = string
    .slice(0, 30)
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-');
  const uuid = crypto.randomUUID().slice(0, 6);

  return `${textString}-${uuid}`;
};
