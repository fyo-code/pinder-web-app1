import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-gray-900">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Pinder 🐾</h1>
        <p className="mt-4 text-lg text-gray-600">
          Find the perfect match for your pet — connect, swipe, and make new furry friends!
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/login"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Login
          </a>
          <a
            href="/create-pet"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Create Pet
          </a>
          <a
            href="/swipe"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Start Swiping →
          </a>
        </div>

        <div className="mt-12">
          <Image
            src="/pinder-hero.png"
            alt="Pinder preview"
            width={600}
            height={400}
            className="mx-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </main>
  );
}