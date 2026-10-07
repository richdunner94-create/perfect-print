import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingsLib "../lib/bookings";
import Types "../types/bookings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : Map.Map<Nat, Types.Booking>,
  state : { var nextBookingId : Nat },
) {
  public shared func createBooking(
    name : Text,
    phone : Text,
    email : Text,
    serviceType : Text,
    preferredDate : Text,
    preferredTime : Text,
    notes : Text,
  ) : async Nat {
    BookingsLib.create(bookings, state, name, phone, email, serviceType, preferredDate, preferredTime, notes);
  };

  public query ({ caller }) func listBookings() : async [Types.Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    BookingsLib.listAll(bookings);
  };

  public shared ({ caller }) func updateBookingStatus(
    id : Nat,
    status : Types.BookingStatus,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    BookingsLib.updateStatus(bookings, id, status);
  };

  public shared ({ caller }) func deleteBooking(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    BookingsLib.remove(bookings, id);
  };
};
