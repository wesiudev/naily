"use client";
import Image from "next/image";
import heroImage from "../../public/heroimg.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  return (
    <>
      <div className="bg-white relative z-50 w-full flex overflow-visible">
        {/* Content */}
        <div className="container mx-auto flex flex-col-reverse gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative z-10 w-full flex lg:w-[768px]">
            <div className="w-full">
              <div onClick={() => router.push("/login")} className="mb-8 lg:mb-20">
                <h1 className="font-baloo text-4xl xl:text-5xl 2xl:text-6xl font-bold text-zinc-800 mb-4 leading-tight">
                  <span className="inline-block animate-fade-in-up relative">
                    Mniej wiadomości, więcej <br /> klientek
                  </span>
                  {/* <span className="inline-block animate-fade-in-up relative">
                    Manicure
                  </span>
                  <span className="inline-block animate-fade-in-up animation-delay-200 ml-2">
                    w Twojej okolicy
                  </span> */}
                </h1>
                <p className="text-black text-lg animate-fade-in-up animation-delay-400 mb-4 font-poppins">
                  Klientki widzą ceny i wolne terminy, zanim napiszą.
                </p>
                
                <div className="font-poppins text-sm gap-3 flex flex-row items-center">

                <div className="rounded-lg px-3 py-2 bg-blue-400 text-white">
                  Rezerwacje
                </div>
                <div className="rounded-lg px-3 py-2 bg-green-400 text-white">
                  Szkolenia
                </div>
                <div className="rounded-lg px-3 py-2 bg-purple-400 text-white">
                  Kariera
                </div>

                </div>
              </div>

              {/* Search logic with enhanced animations */}
              <div className="animate-fade-in-up animation-delay-800">
                {/* <Logic slugCity={slugCity} /> */}
                <Link
            href="/kreator-profilu"
            className="block w-full text-center lg:w-max lg:max-w-full rounded-full font-semibold p-3 text-base bg-blue-600 text-white hover:bg-blue-700 transition-all px-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Załóż konto i stwórz cennik
          </Link>
                
              </div>
            </div>
          </div>
          <Image
          onClick={() => router.push("/login")}
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
