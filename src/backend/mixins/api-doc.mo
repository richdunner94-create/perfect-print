mixin () {
  public query func getApiDoc() : async Text {
    "# Washington's Perfect Print — Backend API\n\n" #
    "## Purpose\n\n" #
    "This canister backs the Washington's Perfect Print website. It stores and serves\n" #
    "all admin-managed public content (services, posts, visa details), accepts public\n" #
    "appointment bookings and contact messages, and exposes admin-only management\n" #
    "endpoints plus dashboard counts. It also exposes its structured data to the\n" #
    "Caffeine Data Intelligence agent through the OQL `schema()` / `execute()`\n" #
    "endpoints.\n\n" #
    "## Authentication and authorization\n\n" #
    "Identity is the Internet Computer caller principal. The app's frontend pins an\n" #
    "Internet Identity derivation origin, published at\n" #
    "`/.well-known/ii-derivation-origin` when available. An agent already holding the\n" #
    "user's Internet Identity authorization derives the correct per-app principal\n" #
    "against that origin (for example `icp identity link web <name> --app <host>`).\n" #
    "Such a delegation acts with the user's full authority in this app until it\n" #
    "expires.\n\n" #
    "Registration is a prerequisite for any role-guarded call. A direct API caller\n" #
    "must call `_initialize_access_control` once as a signed-in (non-anonymous)\n" #
    "caller before any role-guarded call, including guarded queries. The first\n" #
    "principal to initialize becomes `#admin`; every later principal becomes `#user`.\n" #
    "Anonymous callers are ignored by initialization and remain unregistered.\n\n" #
    "A caller can be unregistered even when it belongs to the app's owner: the\n" #
    "frontend registers a principal only when that caller signs in through the app's\n" #
    "own frontend, so a principal that never did so is unregistered, and a signed-in\n" #
    "caller derived against a different origin is a different principal than the one\n" #
    "the frontend registered.\n\n" #
    "Role checks resolve through `isCallerAdmin()` / `getCallerUserRole()`. A\n" #
    "role-guarded endpoint traps with 'Unauthorized: admin only' for a non-admin\n" #
    "caller. An unregistered signed-in caller traps earlier, inside the role lookup,\n" #
    "with 'User is not registered'; an anonymous caller resolves to `#guest` and is\n" #
    "never an admin, so it receives 'Unauthorized: admin only'.\n\n" #
    "Public (no sign-in required) methods: `listServices`, `getService`, `listPosts`,\n" #
    "`getPost`, `listVisas`, `getVisa`, `createBooking`, `submitContactMessage`,\n" #
    "`getApiDoc`, and the OQL `schema` / `execute` endpoints.\n\n" #
    "Admin-only methods: `createService`, `updateService`, `deleteService`,\n" #
    "`createPost`, `updatePost`, `deletePost`, `updateVisa`, `listBookings`,\n" #
    "`updateBookingStatus`, `deleteBooking`, `listContactMessages`,\n" #
    "`deleteContactMessage`, `getDashboardCounts`.\n\n" #
    "## Units and encodings\n\n" #
    "- `createdAt` is an `Int` timestamp in nanoseconds since the Unix epoch.\n" #
    "- `id` values are `Nat` and are assigned sequentially per collection, starting\n" #
    "  at 0, from a persistent counter.\n" #
    "- `imageUrl` is an optional `Text` URL; `null` means no image.\n" #
    "- `Post.category` is the variant `#promotion | #announcement | #advertising`.\n" #
    "- `Booking.status` is the variant `#pending | #confirmed | #completed |\n" #
    "  #cancelled`.\n" #
    "- `VisaCountry` is the variant `#china | #france | #usa`.\n" #
    "- `preferredDate` and `preferredTime` are free-form `Text` supplied by the\n" #
    "  client; the backend does not parse or validate them.\n" #
    "- `active` (Service) and `published` (Post) are `Bool` visibility flags.\n\n" #
    "## Lifecycle and polling\n\n" #
    "`createBooking` and `submitContactMessage` are update calls that return the new\n" #
    "record's `Nat` id. There is no asynchronous processing: once the call returns,\n" #
    "the record is persisted and immediately visible to admin listing endpoints.\n" #
    "`listBookings` and `listContactMessages` are admin-only queries and can be\n" #
    "polled freely; they return the full collection, so clients should sort and\n" #
    "paginate locally.\n\n" #
    "## Mutation retry safety\n\n" #
    "All create endpoints are non-idempotent: retrying `createBooking`,\n" #
    "`submitContactMessage`, `createService`, or `createPost` creates a duplicate\n" #
    "record with a new id. Update and delete endpoints are idempotent in effect:\n" #
    "`updateService`, `updatePost`, `updateVisa`, and `updateBookingStatus` return\n" #
    "`false` when the target id does not exist, and `deleteService`, `deletePost`,\n" #
    "`deleteBooking`, and `deleteContactMessage` return `false` when nothing was\n" #
    "removed. Deletes are destructive and cannot be undone.\n\n" #
    "## Errors, traps, and gotchas\n\n" #
    "- Admin-only endpoints trap with 'Unauthorized: admin only' for non-admins.\n" #
    "- An unregistered signed-in caller traps with 'User is not registered' when a\n" #
    "  role lookup runs.\n" #
    "- `getService`, `getPost`, and `getVisa` return `null` for an unknown id or\n" #
    "  country rather than trapping.\n" #
    "- `listServices` and `listPosts` return only active/published records to\n" #
    "  non-admins, and the full collection to admins.\n" #
    "- `listVisas` and `getVisa` are public and return all visa details.\n" #
    "- OQL `schema()` and `execute()` are public; the `service` and `post` entities\n" #
    "  are world-readable, while `booking` and `contactMessage` are controller-only.\n" #
    "- The backend never sends cycles out of the canister.\n";
  };
};
