import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/services";

module {
  public func listActive(services : Map.Map<Nat, Types.Service>) : [Types.Service] {
    services.values().filter(func s = s.active).toArray();
  };

  public func listAll(services : Map.Map<Nat, Types.Service>) : [Types.Service] {
    services.values().toArray();
  };

  public func get(services : Map.Map<Nat, Types.Service>, id : Nat) : ?Types.Service {
    services.get(id);
  };

  public func create(
    services : Map.Map<Nat, Types.Service>,
    state : { var nextServiceId : Nat },
    title : Text,
    description : Text,
    imageUrl : ?Text,
    active : Bool,
  ) : Nat {
    let id = state.nextServiceId;
    state.nextServiceId := id + 1;
    services.add(id, {
      id;
      title;
      description;
      imageUrl;
      active;
      createdAt = Time.now();
    });
    id;
  };

  public func update(
    services : Map.Map<Nat, Types.Service>,
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : ?Text,
    active : Bool,
  ) : Bool {
    switch (services.get(id)) {
      case (?existing) {
        services.add(id, {
          id;
          title;
          description;
          imageUrl;
          active;
          createdAt = existing.createdAt;
        });
        true;
      };
      case null { false };
    };
  };

  public func remove(services : Map.Map<Nat, Types.Service>, id : Nat) : Bool {
    switch (services.get(id)) {
      case (?_) { services.remove(id); true };
      case null { false };
    };
  };
};
