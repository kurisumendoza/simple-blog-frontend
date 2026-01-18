export const generateFilename = (file: File) => {
  const ext = file.name.split('.').pop();
  const newFileName = `${crypto.randomUUID()}.${ext}`;

  return newFileName;
};
