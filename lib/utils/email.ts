export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `https://api.agentpome.com/reset-password?token=${token}&email=${email}`;
  console.log(` Password reset link for ${email}: ${resetLink}`);
};