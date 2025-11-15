export default function PizzeriaSectionHeader() {
  return (
    <div className="pl-4 relative z-10 max-w-6xl mx-auto mb-6">
      <h2 className="font-cocosharp !text-zinc-800 !text-2xl lg:!text-3xl">
        Popularne pizzerie
      </h2>
      <p className="text-gray-700 font-cocosharp text-base lg:text-xl max-w-2xl">
        Najlepsze miejsca polecane przez naszą społeczność
      </p>
      <div className="w-24 h-1 bg-gradient-to-r from-primary-200 to-white rounded-full mx-auto mt-6"></div>
    </div>
  );
}
