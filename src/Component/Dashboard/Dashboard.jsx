// Dashboard.jsx
export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-cream text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-oranges font-marker mb-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-peach max-w-xl">
        Use the sidebar to navigate between admin and product management.
      </p>
    </div>
  );
}
