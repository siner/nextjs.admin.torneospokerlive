/* eslint-disable @next/next/no-img-element */
export default function CardTour({ tour }: { tour: any }) {
  return (
    <a href={"/circuitos/" + tour.slug}>
      <div className="w-full shadow-xl h-60">
        <figure className="h-32 md:h-40 mt-4">
          <img
            className="max-h-48 md:max-h-64 mx-auto object-cover"
            src={`https://wsrv.nl/?url=${tour.logo}&w=300&h=150&fit=contain`}
            width={300}
            height={150}
            alt={tour.name}
          />
        </figure>
        <div className="items-center flex justify-center text-center padding p-4 md:p-8 h-32">
          <h2 className="font-bold">{tour.name}</h2>
        </div>
      </div>
    </a>
  );
}
