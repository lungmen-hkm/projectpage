import ThemeToggle from "./theme-toggle";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null; // URL website/demo kalau diisi di GitHub
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  topics?: string[];
  language: string | null;
  updated_at: string;
}

const USERNAME = "lungmen-hkm";
const GITHUB_PROFILE = `https://github.com/${USERNAME}`;
const HIDDEN_TOPIC = "portofolio-hide";

const PORTFOLIO_URL = "https://www.lungmenhkm.xyz";
const PREVIX_URL = "https://previx.lungmenhkm.xyz";
const ROBOCI_URL = "https://roboci.lungmenhkm.xyz";

const languageColors: Record<string, string> = {
  TypeScript: "bg-[#3178c6]",
  JavaScript: "bg-[#f1e05a]",
  Python: "bg-[#3572a5]",
  HTML: "bg-[#e34c26]",
  CSS: "bg-[#563d7c]",
  Dart: "bg-[#00b4ab]",
  "C++": "bg-[#f34b7d]",
  C: "bg-[#555555]",
  Rust: "bg-[#dea584]",
  Go: "bg-[#00add8]",
};

// Nama pendek buat link di navbar. Fallback ke nama repo asli.
const REPO_LABELS: Record<string, string> = {
  traincenter: "Traincenter",
  trainercraft: "Trainercraft",
  "esp32-gas-leak-sensor": "Roboci",
  argabeacon: "ArgaBeacon",
};

function repoLabel(name: string) {
  return REPO_LABELS[name.toLowerCase()] ?? name.replace(/[-_]/g, " ");
}

// "ArgaBeacon" -> "Arga Beacon" for display headings.
function displayTitle(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

async function getGithubRepos(): Promise<Repo[]> {
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
    // 2. GAK PUNYA topic 'portofolio-hide' (!repo.topics?.includes(HIDDEN_TOPIC))
    return data.filter((repo) => {
      const isFork = repo.fork;
      const isHidden = repo.topics?.includes(HIDDEN_TOPIC);
      return !isFork && !isHidden;
    });
  } catch (error) {
    console.error("Gagal ngambil repo GitHub:", error);
    return [];
  }
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 13L16 15L18 15L18 13L20 13L20 11L18 11L18 9L16 9L16 11L4 11L4 13L16 13ZM16 9L16 7L14 7L14 9L16 9ZM16 17L16 15L14 15L14 17L16 17ZM12 7L14 7L14 5L12 5L12 7ZM14 19L14 17L12 17L12 19L14 19Z" />
    </svg>
  );
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      <rect x="1" y="1" width="2" height="6" />
      <rect x="1" y="5" width="6" height="2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="30"
      height="30"
      fill="none"
      aria-hidden="true"
      className="fab-icon"
    >
      {/* back square outline */}
      <rect x="4" y="4" width="26" height="26" stroke="white" strokeWidth="3" />
      {/* foreground square: occludes the back outline and holds the two dots */}
      <rect
        x="18"
        y="18"
        width="26"
        height="26"
        fill="black"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="27" cy="31" r="2.6" fill="white" />
      <circle cx="35" cy="31" r="2.6" fill="white" />
    </svg>
  );
}

function ActionButton({
  href,
  label,
  black,
}: {
  href: string;
  label: string;
  black: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "action-button gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em]",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        black
          ? "border-white/25 text-white focus-visible:outline-white"
          : "border-black/20 text-black focus-visible:outline-black dark:border-white/25 dark:text-white dark:focus-visible:outline-white",
      ].join(" ")}
    >
      <span aria-hidden="true" className="action-sweep" />
      <span className="action-label">{label}</span>
    </a>
  );
}

function ProjectCard({
  repo,
  black = false,
}: {
  repo: Repo;
  black?: boolean;
}) {
  const href = repo.homepage || repo.html_url;
  const topics = (repo.topics ?? [])
    .filter((topic) => topic !== HIDDEN_TOPIC)
    .slice(0, 3);

  return (
    <article
      className={[
        "group flex min-h-[340px] flex-col justify-between p-6 transition-[padding] duration-300 hover:pt-8",
        "md:min-h-[350px]",
        "dark:ring-1 dark:ring-white/10",
        black
          ? "bg-black text-white"
          : "bg-white text-black dark:bg-[#171717] dark:text-white",
      ].join(" ")}
    >
      {/* top */}
      <div className={black ? "flex flex-col items-center text-center" : ""}>
        {black ? (
          <>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
              <span aria-label={`${repo.stargazers_count} stars`}>
                ★ {repo.stargazers_count}
              </span>
              {repo.forks_count > 0 && (
                <span aria-label={`${repo.forks_count} forks`}>
                  Fork {repo.forks_count}
                </span>
              )}
            </div>
            <h2 className="mt-3 font-mono text-[20px] font-bold uppercase leading-[1.12] tracking-[0.01em] md:text-[22px]">
              {displayTitle(repo.name)}
            </h2>
          </>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-mono text-[20px] font-bold uppercase leading-[1.12] tracking-[0.01em] md:text-[22px]">
              {displayTitle(repo.name)}
            </h2>
            <div className="flex shrink-0 items-center gap-2 pt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/55 dark:text-white/55">
              <span aria-label={`${repo.stargazers_count} stars`}>
                ★ {repo.stargazers_count}
              </span>
              {repo.forks_count > 0 && (
                <span aria-label={`${repo.forks_count} forks`}>
                  Fork {repo.forks_count}
                </span>
              )}
            </div>
          </div>
        )}

        <p
          className={[
            "mt-4 max-w-[400px] text-[15px] leading-[1.6]",
            black ? "text-white/70" : "text-black/65 dark:text-white/65",
          ].join(" ")}
        >
          {repo.description || "No description for this project yet."}
        </p>
      </div>

      {/* bottom */}
      <div className="mt-8">
        {topics.length > 0 && (
          <div
            className={[
              "mb-4 flex flex-wrap gap-1.5",
              black ? "justify-center" : "",
            ].join(" ")}
          >
            {topics.map((topic) => (
              <span
                key={topic}
                className={[
                  "border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                  black
                    ? "border-white/25 text-white/70"
                    : "border-black/15 text-black/60 dark:border-white/25 dark:text-white/70",
                ].join(" ")}
              >
                #{topic}
              </span>
            ))}
          </div>
        )}

        <footer
          className={[
            "flex flex-wrap items-center gap-x-5 gap-y-3",
            black ? "justify-center text-center" : "",
          ].join(" ")}
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${repoLabel(repo.name)}`}
            className={[
              "inline-flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300 hover:translate-x-1",
              "focus-visible:outline-2 focus-visible:outline-offset-4",
              black
                ? "focus-visible:outline-white"
                : "focus-visible:outline-black dark:focus-visible:outline-white",
            ].join(" ")}
          >
            <ArrowIcon className="h-6 w-6" />
          </a>

          {repo.language && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">
              <span
                className={`h-2 w-2 rounded-full ${
                  languageColors[repo.language] || "bg-neutral-500"
                }`}
              />
              {repo.language}
            </span>
          )}

          <div
            className={[
              "flex flex-wrap items-center gap-2",
              black ? "justify-center" : "ml-auto",
            ].join(" ")}
          >
            {repo.homepage && (
              <ActionButton href={repo.homepage} label="Live Demo" black={black} />
            )}
            <ActionButton href={repo.html_url} label="Source Code" black={black} />
          </div>
        </footer>
      </div>
    </article>
  );
}

function ProjectGrid({ repos }: { repos: Repo[] }) {
  const rows: Repo[][] = [];
  for (let i = 0; i < repos.length; i += 3) {
    rows.push(repos.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row, rowIndex) => {
        // Sisa 1 project: jadiin kartu lebar biar bento-nya tetap rapi.
        if (row.length === 1) {
          return (
            <div key={rowIndex} className="grid grid-cols-1 gap-5">
              <ProjectCard repo={row[0]} black />
            </div>
          );
        }

        const columns =
          row.length === 3
            ? rowIndex % 2 === 0
              ? "lg:grid-cols-[0.76fr_1fr_1fr]"
              : "lg:grid-cols-[1fr_1fr_0.76fr]"
            : "md:grid-cols-2";

        return (
          <div
            key={rowIndex}
            className={`grid grid-cols-1 gap-5 ${columns}`}
          >
            {row.map((repo, index) => {
              const globalIndex = rowIndex * 3 + index;
              const black =
                row.length === 3 &&
                (globalIndex % 6 === 0 || globalIndex % 6 === 5);

              return (
                <ProjectCard key={repo.id} repo={repo} black={black} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default async function ProjectsPage() {
  const repos = await getGithubRepos();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ---------------------------------- nav ---------------------------------- */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[70px] w-full max-w-[1200px] items-center justify-between gap-4 border-b border-transparent bg-black px-4 dark:border-white/10 sm:px-6">
          <div className="flex min-w-0 items-center gap-7">
            <a
              href="#top"
              aria-label="lungmen projects — back to top"
              className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="flex h-12 w-12 items-center justify-center bg-accent">
                <LogoMark className="h-6 w-6 text-black" />
              </span>
              <span className="hidden text-[21px] font-bold tracking-[-0.03em] text-white min-[360px]:inline">
                lungmen<span className="text-accent">.hkm</span>
              </span>
            </a>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-5 lg:flex"
            >
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] tracking-[-0.01em] text-white/80 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Portofolio
              </a>
              <a
                href={PREVIX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] tracking-[-0.01em] text-white/80 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Previx Project
              </a>
              <a
                href={ROBOCI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] tracking-[-0.01em] text-white/80 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Roboci
              </a>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-5">
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden font-mono text-[12px] tracking-[-0.01em] text-white/80 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:block"
            >
              GitHub
            </a>
            <ThemeToggle />
            <a
              href={`${GITHUB_PROFILE}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent py-1.5 pl-1.5 pr-4 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ArrowIcon className="h-5 w-5" />
              All Repos
            </a>
          </div>
        </div>
      </header>

      {/* --------------------------------- main ---------------------------------- */}
      <main id="top" className="flex-1 pt-[70px]">
        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
          <div className="flex flex-col gap-6 pb-10 pt-12 lg:flex-row lg:items-end lg:justify-between lg:pb-12 lg:pt-16">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-black/60 dark:text-white/60">
                My Open-Source Project.
              </p>
              <h1 className="mt-4 text-[clamp(38px,4.4vw,64px)] font-semibold uppercase leading-[1.02] tracking-[0.015em]">
                Featured Projects
              </h1>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-black/60 dark:text-white/60 lg:text-right">
              Live demos and open-source builds — from mobile apps and game
              mods to connected hardware.
            </p>
          </div>

          <div id="projects" className="scroll-mt-24 pb-20 lg:pb-24">
            {repos.length === 0 ? (
              <div className="flex min-h-[350px] items-center justify-center bg-white p-8 text-center dark:bg-[#171717] dark:ring-1 dark:ring-white/10">
                <p className="font-mono text-sm uppercase tracking-widest text-black/60 dark:text-white/60">
                  No projects found. Check back soon.
                </p>
              </div>
            ) : (
              <ProjectGrid repos={repos} />
            )}
          </div>
        </section>
      </main>

      {/* ------------------------------ floating chat ----------------------------- */}
      <button type="button" aria-label="Open chat" className="fab-button">
        <span aria-hidden="true" className="fab-sweep" />
        <ChatIcon />
      </button>
    </div>
  );
}
