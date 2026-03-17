import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    assets,
    facilityIcons,
    roomCommonData,
} from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms, getToken, axios, navigate } = useAppContext();
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(0);
    const [isAvailable, setIsAvailable] = useState(false);

    // check if room is available or not
    const checkAvailability = async () => {
        try {
            // check if checkindate is greater than checkoutdate
            if (checkInDate > checkOutDate) {
                toast.error("Check-in date should be less than check-out date");
                return;
            }
            const { data } = await axios.post("/api/bookings/check-availability", {
                checkInDate,
                checkOutDate,
                room: id
            });
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true);
                    toast.success("Room is available");
                }
                else {
                    setIsAvailable(false);
                    toast.error("Room is not available");
                }
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // onsubmitHandler function to check availability and book room
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!isAvailable) {
                return checkAvailability();
            }
            else {
                const { data } = await axios.post('/api/bookings/book', {
                    checkInDate,
                    checkOutDate,
                    room: id,
                    guests,
                    paymentMethod: "Pay at Hotel",
                }, { headers: { Authorization: `Bearer ${await getToken()}` } });
                if (data.success) {
                    toast.success(data.message);
                    navigate('/my-bookings');
                    scrollTo(0, 0)
                }
                else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const foundRoom = rooms.find((r) => r._id === id);
        if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(foundRoom.images[0]);
        }
    }, [rooms]);

    if (!room) return null; // ✅ safer than wrapping whole JSX in room &&

    return (
        <div className="py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32">
            {/* room details */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-playfair">
                    {room.hotel.name}{" "}
                    <span className="font-inter text-sm">
                        ({room.roomType})
                    </span>
                </h1>
            </div>

            {/* Room rating */}
            <div className="flex items-center gap-1 mt-2">
                <StarRating />
                <p className="ml-2">200+ Reviews</p>
            </div>

            {/* Room address */}
            <div className="flex items-center gap-1 text-gray-500 mt-2">
                <img
                    src={assets.locationIcon}
                    alt="location-icon"
                    className="w-4 h-4"
                />
                <span>{room.hotel.address}</span>
            </div>

            {/* Room images */}
            <div className="flex flex-col lg:flex-row mt-6 gap-6">
                <div className="lg:w-1/2 w-full">
                    <img
                        src={mainImage}
                        alt="Room"
                        className="w-full rounded-xl shadow-lg object-cover"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
                    {room.images.length > 1 &&
                        room.images.map((image, index) => (
                            <img
                                onClick={() => setMainImage(image)}
                                key={index}
                                src={image}
                                alt={`room-${index}`}
                                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image
                                    ? "outline outline-[3px] outline-orange-500"
                                    : ""
                                    }`}
                            />
                        ))}
                </div>
            </div>

            {/* Room highlights */}
            <div className="flex flex-col md:flex-row md:justify-between mt-10">
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-playfair">
                        Experience Luxury Like Never Before
                    </h1>
                    <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                        {room.amenities.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                            >
                                <img
                                    src={facilityIcons[item]}
                                    alt={item}
                                    className="w-5 h-5"
                                />
                                <p className="text-xs">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-2xl font-medium">
                    ${room.pricePerNight} / night
                </p>
            </div>

            {/* Check-in checkout form */}
            <form
                onSubmit={onSubmitHandler}
                className="bg-white shadow-lg p-6 rounded-xl mx-auto mt-16 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    {/* Check-In */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="checkInDate"
                            className="font-medium text-gray-700"
                        >
                            Check-In
                        </label>
                        <input
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            type="date"
                            id="checkInDate"
                            className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Check-Out */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="checkOutDate"
                            className="font-medium text-gray-700"
                        >
                            Check-Out
                        </label>
                        <input
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={checkInDate}
                            disabled={!checkInDate}
                            type="date"
                            id="checkOutDate"
                            className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="guests"
                            className="font-medium text-gray-700"
                        >
                            Guests
                        </label>
                        <input
                            onChange={(e) => setGuests(e.target.value)}
                            value={guests}
                            type="number"
                            id="guests"
                            placeholder="1"
                            className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Book Now Button */}
                    <div className="flex">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-lg w-full px-6 py-3 font-medium"
                        >
                            {isAvailable ? "Book Now" : "Check Availability"}
                        </button>
                    </div>
                </div>
            </form>

            {/* Common Specifications */}
            <div className="mt-24 space-y-6">
                {roomCommonData.map((spec, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <img
                            src={spec.icon}
                            alt={`${spec.title}-icon`}
                            className="w-6 h-6"
                        />
                        <div>
                            <p className="text-base font-medium">
                                {spec.title}
                            </p>
                            <p className="text-gray-500">{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Room description */}
            <div className="max-w-3xl border-y border-gray-300 my-16 py-10 text-gray-500">
                <p>
                    Guests will be allocated on the ground floor according to
                    availability. You get a comfortable two-bedroom apartment
                    with a true city feeling. The price quoted is for two
                    guests; at the guest slot please mark the number of guests
                    to get the exact price for groups. The guests will be
                    allocated ground floor according to availability. You get
                    the comfortable two-bedroom apartment that has a true city
                    feeling.
                </p>
            </div>

            {/* Hosted by */}
            <div className="flex flex-col items-start gap-4">
                <div className="flex gap-4">
                    <img
                        src={room.hotel.owner.image}
                        alt="Host"
                        className="h-14 w-14 md:h-20 md:w-20 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-lg md:text-xl">
                            Hosted By: {room.hotel.name}
                        </p>
                        <div className="flex items-center mt-1">
                            <StarRating />
                            <p className="ml-2">200+ Reviews</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => toast.success(`Contact: ${room.hotel.contact}`)}
                    className="px-6 py-2.5 mt-4 rounded text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer"
                >
                    Contact Now
                </button>
            </div>
        </div>
    );
};

export default RoomDetails;
