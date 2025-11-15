/* eslint-disable @typescript-eslint/no-explicit-any */

export default function UrlConfig({
  product,
  handleChange,
  error,
}: {
  product: any;
  handleChange: any;
  error: boolean;
}) {
  return (
    <div>
      <h2 className="font-bold mt-6 text-xl text-zinc-800 drop-shadow-xl shadow-black">
        Link do aktualności (np.
        https://quixy.pl/news/quixy-jest-juz-w-internecie)
      </h2>
      <div className="flex items-center">
        <h2 className="text-lg">https://quixy.pl/news/</h2>{" "}
        <input
          type="text"
          value={product.url}
          name="url"
          onChange={(e) => handleChange(e)}
          className={`font-bold bg-gray-300 outline-none w-full p-3 ml-3 border-2 ${
            error && !product.url
              ? "border-red-500 bg-red-200"
              : "border-transparent"
          } border-2`}
        />
      </div>
    </div>
  );
}
