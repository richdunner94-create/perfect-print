import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/contact";

module {
  public func listAll(messages : Map.Map<Nat, Types.ContactMessage>) : [Types.ContactMessage] {
    messages.values().toArray();
  };

  public func create(
    messages : Map.Map<Nat, Types.ContactMessage>,
    state : { var nextContactMessageId : Nat },
    name : Text,
    email : Text,
    phone : Text,
    message : Text,
  ) : Nat {
    let id = state.nextContactMessageId;
    state.nextContactMessageId := id + 1;
    messages.add(id, {
      id;
      name;
      email;
      phone;
      message;
      createdAt = Time.now();
    });
    id;
  };

  public func remove(messages : Map.Map<Nat, Types.ContactMessage>, id : Nat) : Bool {
    switch (messages.get(id)) {
      case (?_) { messages.remove(id); true };
      case null { false };
    };
  };
};
