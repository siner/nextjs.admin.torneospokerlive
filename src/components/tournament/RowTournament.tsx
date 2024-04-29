/* eslint-disable @next/next/no-img-element */
import { formatDate, getTextColor } from "@/lib/utils";

export default function RowTournament(props: any) {
  var { torneo, casino, event } = props;

  const backgroundColor = torneo.casino.color;
  const textColor = getTextColor(backgroundColor);

  let datetorneo = new Date(torneo.date);
  let { datestring, hour } = formatDate(datetorneo);
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let opacity = datetorneo < today ? "0.6" : "1";

  return (
    <a href={"/torneos/" + torneo.slug}>
      <div
        className="flex flex-col w-full bg-base-100 hover:bg-base-200 border-solid border shadow-sm mb-0.5"
        style={{
          opacity: opacity,
        }}
      >
        <div className="flex flex-row w-full md:hidden justify-between px-1 pb-1 bg-secondary">
          {casino && (
            <div className="text-xs md:hidden">{torneo.casino.name}</div>
          )}
          <div className="text-xs">
            {datestring}
            {torneo.time ? " - " + torneo.time.substring(0, 5) : ""}
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="flex items-center justify-between flex-1 cursor-pointer select-none w-full">
            {casino && (
              <div
                className="hidden md:flex flex-col items-center justify-center rounded-full mx-2"
                style={{
                  backgroundColor: backgroundColor,
                }}
              >
                <div className="tooltip" data-tip={torneo.casino.name}>
                  <img
                    src={`https://wsrv.nl/?url=${torneo.casino.logo}&w=30&h=30&fit=contain&mask=circle`}
                    width={30}
                    height={30}
                    alt={"Logo " + torneo.casino.name}
                    className="mx-auto"
                  />
                </div>
              </div>
            )}

            <div className="grow pl-1 mr-2 md:mr-5 p-2">
              <div className="flex space-x-2 items-center content-center font-medium text-sm md:text-base">
                {event && torneo.event && (
                  <div className="tooltip" data-tip={torneo.event.name}>
                    <img
                      src={`https://wsrv.nl/?url=${torneo.event.tour.logo}&w=30&h=30&fit=contain&mask=circle`}
                      width={30}
                      height={30}
                      alt={"Icono " + torneo.event.name}
                      className="w-8 mr-2"
                    />
                  </div>
                )}
                <div className="flex flex-col items-start text-left">
                  <span>{torneo.name}</span>
                  {casino && (
                    <small className="hidden md:inline-block text-xs font-light">
                      {torneo.casino.name}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="pl-1 mr-2 text-right p-2 w-24 md:w-44">
              <div className="text-xs hidden md:block">
                {datestring}
                {torneo.time ? " - " + torneo.time.substring(0, 5) : ""}
              </div>
              <div className="text-base font-bold md:hidden">
                {parseInt(torneo.buyin) > 0 && <span>{torneo.buyin}€</span>}
              </div>
            </div>

            <div className="pl-1 mr-2 text-right p-2 hidden md:block w-24">
              <div className="text-xl font-bold">
                {parseInt(torneo.buyin) > 0 && <span>{torneo.buyin}€</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
