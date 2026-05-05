export default function LogoLoader({ fullScreen = false }) {
  const wrapper = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white"
    : "flex min-h-[50vh] items-center justify-center";

  return (
    <div className={wrapper} aria-label="Loading" role="status">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/anti_images/logo1.jpeg"
        alt="ANTI"
        className="h-20 w-20 animate-pulse rounded-full object-cover opacity-80"
      />
    </div>
  );
}
