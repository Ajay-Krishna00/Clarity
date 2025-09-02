export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-6xl font-extrabold mb-4 text-center text-indigo-600">
        Clarity
      </h1>
      <h1 className="text-4xl font-bold mb-4 text-center">
        Digital Mental Health Support System
      </h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        An MVP platform for students in higher education to access 
        confidential support, self-help resources, and peer connection.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <a
          href="/chat"
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Try Chat Support
        </a>
        <a
          href="/resources"
          className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Browse Resources
        </a>
        <a
          href="/booking"
          className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
        >
          Book Appointment
        </a>
      </div>
    </main>
  );
}
