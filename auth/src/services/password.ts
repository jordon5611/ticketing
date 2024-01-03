import bcrypt from "bcrypt";

export const ComparePassword = async (
  EnteredPassword: string,
  OriginalPassword: string
) => {
  return await bcrypt.compare(EnteredPassword, OriginalPassword);
};
