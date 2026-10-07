import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ServicesLib "../lib/services";
import Types "../types/services";

mixin (
  accessControlState : AccessControl.AccessControlState,
  services : Map.Map<Nat, Types.Service>,
  state : { var nextServiceId : Nat },
) {
  public query ({ caller }) func listServices() : async [Types.Service] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      ServicesLib.listAll(services);
    } else {
      ServicesLib.listActive(services);
    };
  };

  public query func getService(id : Nat) : async ?Types.Service {
    ServicesLib.get(services, id);
  };

  public shared ({ caller }) func createService(
    title : Text,
    description : Text,
    imageUrl : ?Text,
    active : Bool,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    ServicesLib.create(services, state, title, description, imageUrl, active);
  };

  public shared ({ caller }) func updateService(
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : ?Text,
    active : Bool,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    ServicesLib.update(services, id, title, description, imageUrl, active);
  };

  public shared ({ caller }) func deleteService(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    ServicesLib.remove(services, id);
  };
};
