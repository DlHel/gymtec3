import { ClientSidebar } from "./components/ClientSidebar";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
        <ClientSidebar />
      </div>
      <main className="md:pl-72">
        {children}
      </main>
    </div>
  );
} 