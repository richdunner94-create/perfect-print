import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ContactLib "../lib/contact";
import Types "../types/contact";

mixin (
  accessControlState : AccessControl.AccessControlState,
  messages : Map.Map<Nat, Types.ContactMessage>,
  state : { var nextContactMessageId : Nat },
) {
  public shared func submitContactMessage(
    name : Text,
    email : Text,
    phone : Text,
    message : Text,
  ) : async Nat {
    ContactLib.create(messages, state, name, email, phone, message);
  };

  public query ({ caller }) func listContactMessages() : async [Types.ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    ContactLib.listAll(messages);
  };

  public shared ({ caller }) func deleteContactMessage(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    ContactLib.remove(messages, id);
  };
};
