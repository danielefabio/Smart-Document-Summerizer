export { cn } from "cn"

export const getUniqueId = () => {
  return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}