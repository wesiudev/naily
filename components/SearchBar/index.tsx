import Image from "next/image";
import Logic from "./Logic";
import heroImage from "../../public/heroimg.png";

export default async function SearchBar({ slugCity }: { slugCity: string }) {
  return (
    <>
      <div className="bg-white relative z-50 w-full flex overflow-visible">
        {/* Content */}
        <div className="container mx-auto flex flex-col-reverse gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative z-10 w-full flex lg:w-[768px]">
            <div className="w-full">
              <div className="mb-8 lg:mb-20">
                <h1 className="font-baloo text-4xl xl:text-5xl font-bold text-zinc-800 mb-4 leading-tight">
                  <span className="inline-block animate-fade-in-up relative">
                    Manicure
                  </span>
                  <span className="inline-block animate-fade-in-up animation-delay-200 ml-2">
                    w Twojej okolicy
                  </span>
                </h1>
                <p className="text-black text-lg animate-fade-in-up animation-delay-400 mt-4 font-poppins">
                  Znajdź najlepsze stylistki manicure i pedicure
                </p>
              </div>

              {/* Search logic with enhanced animations */}
              <div className="animate-fade-in-up animation-delay-800">
                <Logic slugCity={slugCity} />
              </div>
            </div>
          </div>
          <Image
            src={heroImage}
            alt="Hero Image"
            width={1000}
            height={1000}
            className="w-[60vw] sm:w-[50vw] mx-auto lg:mx-0 lg:w-[40vw] xl:w-[35vw] 2xl:[30vw] h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
