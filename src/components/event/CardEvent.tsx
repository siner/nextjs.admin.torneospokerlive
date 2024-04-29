/* eslint-disable @next/next/no-img-element */
import { getSimpleDate } from "@/lib/utils";

export default function CardEvent(props: { event: any; showCasino: boolean }) {
  var evento = props.event;
  var showCasino = props.showCasino;
  let datestringfrom = getSimpleDate(evento.from);
  let datestringto = getSimpleDate(evento.to);
  const bg = evento.casino.color;

  return (
    <a href={"/eventos/" + evento.slug} className="block">
      <div className="indicator w-full">
        <div className="grid card w-full bg-base-100 shadow-lg rounded-md h-80">
          <figure
            className="flex justify-center items-center w-full h-40"
            style={{ backgroundColor: bg }}
          >
            <img
              className="mx-auto"
              src={`https://wsrv.nl/?url=${evento.tour.logo}&w=200&h=200&fit=contain&mask=circle`}
              width={100}
              height={100}
              alt={evento.name}
            />
            {showCasino && (
              <img
                className="mx-auto"
                src={`https://wsrv.nl/?url=${evento.casino.logo}&w=200&h=200&fit=contain&mask=circle`}
                width={100}
                height={100}
                alt={evento.casino.name}
              />
            )}
          </figure>
          <div className="card-body items-center text-center p-4 md:p-8">
            <div className="flex justify-between mb-4 w-full">
              <div className="flex content-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
                <span>{datestringfrom}</span>
              </div>
              <div className="flex content-center space-x-1">
                <span>{datestringto}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="card-title">
              <p className="font-bold mb-2">{evento.name}</p>
              <p className="text-sm">{evento.casino.name}</p>
            </h2>
          </div>
        </div>
      </div>
    </a>
  );
}
