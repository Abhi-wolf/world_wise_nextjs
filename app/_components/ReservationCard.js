import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import Image from "next/image";
import DeleteReservation from "./DeleteReservation";
import Link from "next/link";
import PaymentButton from "./PaymentButton";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

async function ReservationCard({ booking, onDelete, user }) {
  const {
    id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    cabins: { name, image },
    isPaid,
  } = booking;

  return (
    <div className="flex flex-col md:flex-row border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-2 md:px-6 py-3 flex flex-col">
        <div className="flex gap-4 items-center justify-between">
          <h3 className="text-md md:text-xl text-center font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
          {isPast(new Date(startDate)) ? (
            <span className="bg-yellow-800 text-yellow-200 h-5 md:h-7 px-2 md:px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-5 md:h-7 px-2 md:px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <p className="text-sm md:text-lg text-primary-300">
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>

        <div className="flex flex-col md:flex-row justify-between mt-auto gap-3 ">
          <div className="grid grid-cols-3 justify-between items-center gap-1 md:gap-6  ">
            <p className="text-md md:text-xl font-semibold text-accent-400">
              ₹{totalPrice}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-primary-300">&bull;</p>
              <p className="text-md md:text-lg text-primary-300">
                {numGuests} guest{numGuests > 1 && "s"}
              </p>
            </div>

            <p>
              {isPaid && (
                <span className=" flex justify-center items-center text-xs md:text-sm md:px-3 py-1 md:py-2 bg-green-600 rounded-xl">
                  Paid
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="md:ml-auto text-sm text-primary-400">
              Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-row md:flex-col justify-between items-center   border md:border-l border-primary-800 w-full md:w-[100px]`}
      >
        {!isPast(startDate) ? (
          <>
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300  md:border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="mt-1">Edit</span>
            </Link>
            {!isPaid && (
              <DeleteReservation bookingId={id} onDelete={onDelete} />
            )}
            {isPaid ? (
              <div className=" flex justify-center items-center font-bold flex-grow">
                <span className="text-sm  px-2 py-1 bg-green-500 rounded-[40%]">
                  Paid
                </span>
              </div>
            ) : (
              <PaymentButton bookingId={id} amount={totalPrice} user={user} />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ReservationCard;
