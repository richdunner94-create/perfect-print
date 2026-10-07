import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/bookings";

module {
  public func listAll(bookings : Map.Map<Nat, Types.Booking>) : [Types.Booking] {
    bookings.values().toArray();
  };

  public func create(
    bookings : Map.Map<Nat, Types.Booking>,
    state : { var nextBookingId : Nat },
    name : Text,
    phone : Text,
    email : Text,
    serviceType : Text,
    preferredDate : Text,
    preferredTime : Text,
    notes : Text,
  ) : Nat {
    let id = state.nextBookingId;
    state.nextBookingId := id + 1;
    bookings.add(id, {
      id;
      name;
      phone;
      email;
      serviceType;
      preferredDate;
      preferredTime;
      notes;
      status = #pending;
      createdAt = Time.now();
    });
    id;
  };

  public func updateStatus(
    bookings : Map.Map<Nat, Types.Booking>,
    id : Nat,
    status : Types.BookingStatus,
  ) : Bool {
    switch (bookings.get(id)) {
      case (?existing) {
        bookings.add(id, {
          id;
          name = existing.name;
          phone = existing.phone;
          email = existing.email;
          serviceType = existing.serviceType;
          preferredDate = existing.preferredDate;
          preferredTime = existing.preferredTime;
          notes = existing.notes;
          status;
          createdAt = existing.createdAt;
        });
        true;
      };
      case null { false };
    };
  };

  public func remove(bookings : Map.Map<Nat, Types.Booking>, id : Nat) : Bool {
    switch (bookings.get(id)) {
      case (?_) { bookings.remove(id); true };
      case null { false };
    };
  };
};
