

export const MD5 = async (str: string) => {
  const { createHash } = await import('crypto');
  let md5sum = createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};