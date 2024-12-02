import ClientPage from "./ClientPage";

export default function Home() {
  return (
    <main className="flex flex-col p-6 pt-10 pb-16 h-full items-center">
      <h1 className="text-6xl font-normal text-center mb-4">SamiOne</h1>
      <h6 className="font-normal text-center mb-10">
        The Future of Legacy Media
      </h6>
      <ClientPage />
    </main>
  );
}
