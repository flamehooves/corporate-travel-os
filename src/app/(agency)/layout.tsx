import { SidebarNav, MobileBottomNav } from "@/components/sidebar-nav";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Global backdrop — shared by every agency page */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg,#020617 0%,#0e0b2e 15%,#1a1060 35%,#2d0f77 55%,#4a1d96 75%,#6d28d9 100%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {(
            [
              [8,12],[15,35],[23,8],[32,55],[41,22],[52,41],[61,15],[74,68],
              [83,30],[91,50],[5,70],[18,85],[29,60],[47,78],[66,45],[79,88],
              [88,65],[95,20],[38,92],[57,5],[12,48],[70,25],[44,12],[85,78],
              [3,40],[25,90],[58,28],[72,55],[96,75],[35,18],[62,82],[48,55],
            ] as [number, number][]
          ).map(([cx, cy], i) => (
            <circle
              key={i}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r={i % 7 === 0 ? "2.2" : i % 3 === 0 ? "1.4" : "0.9"}
              fill="white"
              opacity={0.07 + (i % 7) * 0.04}
            />
          ))}
          <path
            d="M 5% 85% Q 38% 18% 95% 52%"
            stroke="white" strokeWidth="0.7" fill="none" opacity="0.07" strokeDasharray="10 5"
          />
          <path
            d="M 12% 72% Q 55% 12% 88% 78%"
            stroke="white" strokeWidth="0.5" fill="none" opacity="0.05" strokeDasharray="7 4"
          />
        </svg>
        <svg
          className="absolute right-[5vw] top-[8vh] opacity-[0.035] rotate-12"
          style={{ width: "35vw", maxWidth: 400 }}
          viewBox="0 0 56 32" fill="white"
        >
          <path d="M54 16L2 2l3.5 14L2 30 54 16Z" />
          <path d="M14 16L1 10l2 6-2 6 13-6Z" />
          <path d="M42 16l-7-6 1.5 6-1.5 6 7-6Z" />
        </svg>
      </div>

      <SidebarNav />
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
