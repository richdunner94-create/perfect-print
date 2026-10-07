import Map "mo:core/Map";
import BookingTypes "../types/bookings";
import ContactTypes "../types/contact";
import PostTypes "../types/posts";
import ServiceTypes "../types/services";
import Types "../types/dashboard";

module {
  public func counts(
    services : Map.Map<Nat, ServiceTypes.Service>,
    posts : Map.Map<Nat, PostTypes.Post>,
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    messages : Map.Map<Nat, ContactTypes.ContactMessage>,
  ) : Types.DashboardCounts {
    var pending = 0;
    for (booking in bookings.values()) {
      switch (booking.status) {
        case (#pending) { pending += 1 };
        case (_) {};
      };
    };
    {
      services = services.size();
      posts = posts.size();
      pendingAppointments = pending;
      totalAppointments = bookings.size();
      contactMessages = messages.size();
    };
  };
};
