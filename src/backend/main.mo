import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import IntValue "mo:caffeineai-oql/IntValue";
import BookingTypes "types/bookings";
import ContactTypes "types/contact";
import PostTypes "types/posts";
import ServiceTypes "types/services";
import VisaTypes "types/visas";
import ApiDocMixin "mixins/api-doc";
import BookingsApi "mixins/bookings-api";
import ContactApi "mixins/contact-api";
import DashboardApi "mixins/dashboard-api";
import PostsApi "mixins/posts-api";
import ServicesApi "mixins/services-api";
import VisasApi "mixins/visas-api";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let services : Map.Map<Nat, ServiceTypes.Service>;
  let posts : Map.Map<Nat, PostTypes.Post>;
  let visas : Map.Map<VisaTypes.VisaCountry, VisaTypes.VisaDetails>;
  let bookings : Map.Map<Nat, BookingTypes.Booking>;
  let contactMessages : Map.Map<Nat, ContactTypes.ContactMessage>;
  let counters : {
    var nextServiceId : Nat;
    var nextPostId : Nat;
    var nextBookingId : Nat;
    var nextContactMessageId : Nat;
  };

  include ServicesApi(accessControlState, services, counters);
  include PostsApi(accessControlState, posts, counters);
  include VisasApi(accessControlState, visas);
  include BookingsApi(accessControlState, bookings, counters);
  include ContactApi(accessControlState, contactMessages, counters);
  include DashboardApi(accessControlState, services, posts, bookings, contactMessages);
  include ApiDocMixin();

  include Expose({
    entities = [
      services.toEntityManual("service", "Service", "id")
        .sample({ id = 0; title = ""; description = ""; imageUrl = null; active = true; createdAt = 0 })
        .payload("id", func s = s.id)
        .payload("title", func s = s.title)
        .payload("description", func s = s.description)
        .payload("imageUrl", func s = s.imageUrl ?? "")
        .payload("active", func s = s.active)
        .payload("createdAt", func s = s.createdAt)
        .public_()
        .build(),
      posts.toEntityManual("post", "Post", "id")
        .sample({ id = 0; title = ""; body = ""; imageUrl = null; category = #promotion; published = true; createdAt = 0 })
        .payload("id", func p = p.id)
        .payload("title", func p = p.title)
        .payload("body", func p = p.body)
        .payload("imageUrl", func p = p.imageUrl ?? "")
        .payload("category", func p = switch (p.category) { case (#promotion) "promotion"; case (#announcement) "announcement"; case (#advertising) "advertising" })
        .payload("published", func p = p.published)
        .payload("createdAt", func p = p.createdAt)
        .public_()
        .build(),
      bookings.toEntityManual("booking", "Booking", "id")
        .sample({ id = 0; name = ""; phone = ""; email = ""; serviceType = ""; preferredDate = ""; preferredTime = ""; notes = ""; status = #pending; createdAt = 0 })
        .payload("id", func b = b.id)
        .payload("name", func b = b.name)
        .payload("phone", func b = b.phone)
        .payload("email", func b = b.email)
        .payload("serviceType", func b = b.serviceType)
        .payload("preferredDate", func b = b.preferredDate)
        .payload("preferredTime", func b = b.preferredTime)
        .payload("notes", func b = b.notes)
        .payload("status", func b = switch (b.status) { case (#pending) "pending"; case (#confirmed) "confirmed"; case (#completed) "completed"; case (#cancelled) "cancelled" })
        .payload("createdAt", func b = b.createdAt)
        .controllerOnly()
        .build(),
      contactMessages.toEntity("contactMessage", "ContactMessage", "id")
        .sample({ id = 0; name = ""; email = ""; phone = ""; message = ""; createdAt = 0 })
        .controllerOnly()
        .build(),
    ];
  });
};
