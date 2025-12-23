export default function authMiddleware(req, res, next) {
  // TEMP AUTH — replace with JWT later
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = { id: userId };
  next();
}