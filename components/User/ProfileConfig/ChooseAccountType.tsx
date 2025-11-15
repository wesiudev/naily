"use client";
import { setUser } from "@/redux/slices/user";
import { RootState } from "@/redux/store";
import { FaUserNinja } from "react-icons/fa6";
import { MdSpa } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function ChooseAccountType({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const seek = user?.seek;
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-[1rem]">
        <button
          onClick={() => {
            dispatch(setUser({ ...user, seek: false }));
          }}
          className={`hover:bg-white hover:shadow-sm bg-white hover:shadow-[#46829cc5gray-200 duration-300 p-3 flex flex-col py-5 border-gray-300 border hover:border-[#126b91] ${
            !seek &&
            "bg-[#46829c27] shadow-[#46829cc5] shadow-sm border-[#126b91]"
          }`}
        >
          <div className="flex flex-row justify-between items-start w-full">
            <MdSpa className="text-3xl" />
            <div
              className={`relative flex items-center justify-center border-gray-500 rounded-full h-5 w-5 border-[2px]`}
            >
              <div
                className={`${
                  !seek && "border-[10px] duration-75 border-gray-500"
                } w-0 h-0 bg-[#126b91] rounded-full`}
              ></div>
              <div
                className={`${
                  !seek && "border duration-75 border-white"
                } w-2.5 h-2.5 rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
              ></div>
            </div>
          </div>
          <span className="text-left font-gotham font-light text-black  mt-2">
            Dołączam jako salon kosmetyczny
          </span>
        </button>
        <button
          onClick={() => {
            dispatch(setUser({ ...user, seek: true }));
          }}
          className={`hover:bg-white hover:shadow-sm hover:shadow-[#46829cc5] bg-gray-200 duration-300 p-3 flex flex-col py-5 border-gray-500 border hover:border-[#126b91] ${
            seek &&
            "bg-[#46829c27] shadow-[#46829cc5] shadow-sm border-[#126b91]"
          }`}
        >
          <div className="flex flex-row justify-between items-start w-full">
            <FaUserNinja className="text-2xl" />

            <div
              className={`relative flex items-center justify-center border-gray-500 rounded-full h-5 w-5 border-[2px]`}
            >
              <div
                className={`${
                  seek && "border-[10px] duration-75 border-gray-500"
                } w-0 h-0 bg-[#126b91] rounded-full`}
              ></div>
              <div
                className={`${
                  seek && "border duration-75 border-white"
                } w-2.5 h-2.5 rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
              ></div>
            </div>
          </div>

          <span className="text-left font-gotham font-light text-black mt-2">
            Dołączam jako pojedyncza specjalistka
          </span>
        </button>
      </div>
      <div className="flex items-center justify-center w-full">
        <button
          onClick={() => {
            setStep(1);
          }}
          className="w-max mx-auto px-[1.5rem] py-[0.6rem] bg-green-500 text-white rounded-md"
        >
          Dalej (2/4)
        </button>
      </div>
    </div>
  );
}
