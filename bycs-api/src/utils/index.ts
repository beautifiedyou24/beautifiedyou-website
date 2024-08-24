import * as bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const passwordMatches = await bcrypt.compare(password, hashedPassword);
  return passwordMatches;
}
