import Link from "next/link";
import { Plane } from "lucide-react";

export default function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">Travelio</span>
              <span className="text-xs text-muted-foreground ml-1.5">Client Portal</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Secure workspace · All conversations are private
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
