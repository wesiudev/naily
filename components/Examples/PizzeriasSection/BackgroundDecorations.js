export default function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <div className="absolute top-8 left-8 w-32 h-32 bg-white rounded-full blur-3xl"></div>
      <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full blur-2xl"></div>
    </div>
  );
}
