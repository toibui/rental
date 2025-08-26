import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <Image
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <h1 className="text-2xl font-bold">Welcome to Home Page</h1>
    </div>
  );
}
