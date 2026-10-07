import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingTypes "../types/bookings";
import ContactTypes "../types/contact";
import DashboardLib "../lib/dashboard";
import Types "../types/dashboard";
import PostTypes "../types/posts";
import ServiceTypes "../types/services";

mixin (
  accessControlState : AccessControl.AccessControlState,
  services : Map.Map<Nat, ServiceTypes.Service>,
  posts : Map.Map<Nat, PostTypes.Post>,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
  messages : Map.Map<Nat, ContactTypes.ContactMessage>,
) {
  public query ({ caller }) func getDashboardCounts() : async Types.DashboardCounts {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    DashboardLib.counts(services, posts, bookings, messages);
  };
};
