
'use client';
import { useEffect } from 'react';

export default function TopCreatorsPage() {
  useEffect(() => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/styles.css';
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { db } from "/likeflow.js";
      import { getDocs, collection, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

      async function loadRanking() {
          const postsRef = collection(db, "posts");
          const q = query(postsRef, orderBy("likesWeek", "desc"), limit(100));
          const posts = await getDocs(q);
          let list = [];

          posts.forEach(p => {
              const d = p.data();
              if (!d.likesWeek) d.likesWeek = 0;
              list.push(d);
          });

          // The sorting is already done by the query, but we can keep it as a fallback.
          // list.sort((a,b)=> b.likesWeek - a.likesWeek);

          const box = document.getElementById("rankingContainer");
          if (!box) return;
          box.innerHTML = "";

          list.forEach((p, i) => {
              box.innerHTML += \`
              <div class="rank-card">
                  <div class="rank-num">\${i+1}</div>
                  <img src="\${p.authorPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}" class="rank-author">
                  <div class="rank-info">
                      <div class="rank-name">\${p.authorName || "Anonimo"}</div>
                      <div class="rank-likes">❤️ \${p.likes || 0} totali</div>
                      <div class="rank-week">🔥 \${p.likesWeek || 0} questa settimana</div>
                  </div>
              </div>\`;
          });
      }

      loadRanking();
    `;
    document.body.appendChild(script);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
        <h1 className="ranking-title text-4xl font-bold text-center text-yellow-300 mb-8">🔥 Classifica Settimanale</h1>
        <div id="rankingContainer"></div>
    </div>
  );
}
