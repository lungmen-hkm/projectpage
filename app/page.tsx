import React from "react";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null; // URL website/demo kalau diisi di GitHub
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  topics: string[];
  language: string;
  updated_at: string;
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  HTML: "bg-orange-500",
  CSS: "bg-purple-500",
  C: "bg-gray-400",
  "C++": "bg-pink-500",
  Rust: "bg-amber-600",
  Go: "bg-cyan-500",
};

async function getGithubRepos(): Promise<Repo[]> {
  const USERNAME = "lungmen-hkm"; // <-- Ganti username lo

  const headers: Record<string, string> = {
    "User-Agent": "Nextjs-Portfolio",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
      {
        next: { revalidate: 3600 },
        headers: headers,
      }
    );

    if (!res.ok) return [];

    const data: Repo[] = await res.json();

    // Filter Logic:
    // 1. Bukan repo hasil fork orang lain (!repo.fork)
    // 2. GAK PUNYA topic 'portofolio-hide' (!repo.topics?.includes('portfolio-hide'))
    return data.filter((repo) => {
      const isFork = repo.fork;
      const isHidden = repo.topics?.includes("portofolio-hide");
      return !isFork && !isHidden;
    });
  } catch (error) {
    console.error("Gagal ngambil repo GitHub:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const repos = await getGithubRepos();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-neutral-200">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12 border-b border-neutral-800 pb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Featured Projects
          </h1>
          <p className="text-neutral-400 mt-3 text-base sm:text-lg max-w-2xl">
            My Open-Source Project.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {repos.length === 0 ? (
            <p className="text-neutral-500 col-span-2 text-center py-10">
              No Data...
            </p>
          ) : (
            repos.map((repo) => (
              <div
                key={repo.id}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/80"
              >
                <div>
                  {/* Header Title & Stars */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="font-semibold text-lg text-neutral-100 group-hover:text-emerald-400 transition-colors">
                      {repo.name}
                    </h2>

                    <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-700/50">
                      <span className="flex items-center gap-1">
                        ⭐ {repo.stargazers_count}
                      </span>
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          🍴 {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-6">
                    {repo.description || "Tidak ada deskripsi untuk proyek ini."}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                  {/* Topics / Tags */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {repo.topics
                        .filter((t) => t !== "portfolio-hide") // Sembunyiin tag hide biar ga nampil
                        .slice(0, 3)
                        .map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/40"
                          >
                            #{topic}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Footer Info & Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Language Badge */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                      {repo.language && (
                        <>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              languageColors[repo.language] || "bg-neutral-600"
                            }`}
                          />
                          <span>{repo.language}</span>
                        </>
                      )}
                    </div>

                    {/* DUA TOMBOL REDIRECT (DEMO & REPO) */}
                    <div className="flex items-center gap-2">
                      {/* Tombol Demo (Cuma nampil kalau field homepage diisi di GitHub) */}
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        >
                          Live Demo ↗
                        </a>
                      )}

                      {/* Tombol Repo GitHub */}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700 transition-colors"
                      >
                        Source Code
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}