import { setUser } from "@/redux/slices/user";
import { IService, User } from "@/types";
import { getServices } from "@/utils/getServices";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function DisplaySettings({
  user,
  setProfileEditOpen,
  setServicesOpen,
}: {
  user: User;
  setProfileEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setServicesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [services, setServices] = useState<{
    pedicure: IService[];
    manicure: IService[];
  }>({
    pedicure: [],
    manicure: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      getServices().then((res) => {
        const updatedServices = {
          manicure: [] as IService[],
          pedicure: [] as IService[],
        };
        res.forEach((service: IService) => {
          if (service.flatten_name.includes("manicure"))
            updatedServices.manicure.push(service);
          else updatedServices.pedicure.push(service);
        });
        setServices(updatedServices);
        setLoading(false);
      });
    }
  }, [loading]);
  const dispatch = useDispatch();
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col">
        <p>
          Pamiętaj o sprecyzowaniu detali swoich usług w specjalnym panelu
          usług, który znajdziesz tutaj:{" "}
          <button
            onClick={() => {
              setProfileEditOpen(false);
              setServicesOpen(true);
            }}
            className="text-sm text-white bg-blue-600 px-2 py-0.5 rounded-md"
          >
            Panel usług
          </button>
        </p>
      </div>

      {/* Manicure Services */}
      <div className={`text-lg mt-4`}>Usługi manicure</div>
      <div className="w-full mt-2 p-3 flex flex-col gap-2 max-h-[200px] overflow-y-auto bg-gray-50 rounded-md border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center flex-col py-12">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <p className="text-gray-500 italic mt-2 text-sm">
              Wczytywanie usług manicure
            </p>
          </div>
        ) : (
          services?.manicure?.map((item) => (
            <button
              key={item.flatten_name}
              onClick={() =>
                dispatch(
                  setUser({
                    ...user,
                    services: user.services.some(
                      (s) => s.flatten_name === item.flatten_name
                    )
                      ? user.services.filter(
                          (service) =>
                            service.flatten_name !== item.flatten_name
                        )
                      : [...user.services, item],
                  })
                )
              }
              className={`${
                user.services.some((s) => s.flatten_name === item.flatten_name)
                  ? "bg-green-500 text-white font-bold"
                  : "bg-white hover:bg-gray-100 text-zinc-800"
              } text-sm p-2 rounded-md border border-gray-300`}
            >
              {item.real_name}
            </button>
          ))
        )}
      </div>
      <div className={`text-lg mt-4`}>Usługi pedicure</div>
      <div className="w-full mt-2 p-3 flex flex-col gap-2 max-h-[200px] overflow-y-auto bg-gray-50 rounded-md border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center flex-col py-12">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <p className="text-gray-500 italic mt-2 text-sm">
              Wczytywanie usług pedicure
            </p>
          </div>
        ) : (
          services?.pedicure?.map((item) => (
            <button
              key={item.flatten_name}
              onClick={() =>
                dispatch(
                  setUser({
                    ...user,
                    services: user.services.some(
                      (s) => s.flatten_name === item.flatten_name
                    )
                      ? user.services.filter(
                          (service) =>
                            service.flatten_name !== item.flatten_name
                        )
                      : [...user.services, item],
                  })
                )
              }
              className={`${
                user.services.some((s) => s.flatten_name === item.flatten_name)
                  ? "bg-green-500 text-white font-bold"
                  : "bg-white hover:bg-gray-100 text-zinc-800"
              } text-sm p-2 rounded-md border border-gray-300`}
            >
              {item.real_name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
