import BackgroundDecorations from "./BackgroundDecorations";

export default function PizzeriaSectionSkeleton() {
  return (
    <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 py-12 w-full">
      <BackgroundDecorations />

      {/* Header skeleton */}
      <div className="pl-4 relative z-10 max-w-6xl mx-auto mb-6">
        <div className="h-8 bg-white/20 rounded animate-pulse mb-2"></div>
        <div className="h-6 bg-white/20 rounded w-3/4 animate-pulse mb-6"></div>
        <div className="w-24 h-1 bg-white/20 rounded-full animate-pulse"></div>
      </div>

      {/* Slider skeleton */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4">
          {/* Generate 3 skeleton cards */}
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex-shrink-0 w-80 lg:w-96">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl overflow-hidden shadow-large border border-white/20">
                {/* Image skeleton */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 lg:h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                    {/* Shimmer effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ animation: "shimmer 2s ease-in-out infinite" }}
                    ></div>
                  </div>

                  {/* Rating badge skeleton */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-medium">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-12 h-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="p-6 lg:p-8">
                  <div className="space-y-4">
                    {/* Restaurant name skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    </div>

                    {/* Location skeleton */}
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
                    </div>

                    {/* Description skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                    </div>

                    {/* CTA skeleton */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
