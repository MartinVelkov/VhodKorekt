import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/widgets/layout";

import styles from "../css/BlogPage.module.css";

type Blog = {
  id: string;
  heading?: string;
  text?: string;
  imageUrl?: string;
};

export function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const blogSnapshot = await getDocs(collection(db, "blogs"));
      const blogList: Blog[] = blogSnapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Blog, "id">),
      }));
      setBlogs(blogList);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadMore = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <>
      {/* Hero */}
      <header className={styles.hero} aria-labelledby="blog-hero-title">
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroInner}>
          <h1 id="blog-hero-title" className={styles.heroTitle}>
            Блог
          </h1>
          <p className={styles.heroSubtitle}>
            Практични съвети и актуални теми за управление и поддръжка на сгради.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            {isLoading ? (
              <div className={styles.state}>
                <div className={styles.skeletonGrid} aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={styles.skeletonCard} />
                  ))}
                </div>
                <p className={styles.stateText}>Зареждане на статии…</p>
              </div>
            ) : blogs.length > 0 ? (
              <div className={styles.grid}>
                {blogs.map((blog) => {
                  const title = blog.heading?.trim() || "Без заглавие";
                  const text = blog.text?.trim() || "";
                  const preview =
                    text.length > 120 ? `${text.slice(0, 120)}…` : text;

                  return (
                    <article key={blog.id} className={styles.card}>
                      {blog.imageUrl ? (
                        <div className={styles.media}>
                          <img
                            src={blog.imageUrl}
                            alt={title}
                            className={styles.mediaImg}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className={styles.mediaFallback} aria-hidden="true" />
                      )}

                      <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>{title}</h2>

                        <p className={styles.cardText}>
                          {preview || "Няма наличен текст за преглед."}
                        </p>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.cta}
                            onClick={() => handleReadMore(blog.id)}
                          >
                            Виж повече
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty}>
                <h2 className={styles.emptyTitle}>Няма налични статии</h2>
                <p className={styles.emptyText}>
                  В момента няма публикувани материали. Проверете отново по-късно.
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className={styles.footerWrap}>
          <Footer />
        </footer>
      </main>
    </>
  );
}