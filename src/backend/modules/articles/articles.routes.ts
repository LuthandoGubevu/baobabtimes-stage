import { Router } from "express";
import { prisma } from "../../../lib/prisma.ts";

const router = Router();

// List published articles
router.get("/", async (req, res) => {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true, category: true },
    orderBy: { publishedAt: "desc" },
  });
  res.json(articles);
});

// Get article by slug
router.get("/:slug", async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { slug: req.params.slug },
    include: { author: true, category: true },
  });
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json(article);
});

// Create article (contributor/admin)
router.post("/", async (req, res) => {
  const { title, excerpt, content, imageUrl, categoryId, authorId } = req.body;
  const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
  
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      categoryId,
      authorId,
      status: "DRAFT",
    },
  });
  res.status(201).json(article);
});

export default router;
