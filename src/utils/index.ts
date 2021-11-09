export const parseAuth = (auth: string) => {
  const [username, password] = Buffer.from(auth, "base64")
    .toString("ascii")
    .split(":");
  return { username, password };
}
  
