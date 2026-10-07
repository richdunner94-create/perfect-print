import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import VisasLib "../lib/visas";
import Types "../types/visas";

mixin (
  accessControlState : AccessControl.AccessControlState,
  visas : Map.Map<Types.VisaCountry, Types.VisaDetails>,
) {
  public query func listVisas() : async [Types.VisaDetails] {
    VisasLib.list(visas);
  };

  public query func getVisa(country : Types.VisaCountry) : async ?Types.VisaDetails {
    VisasLib.get(visas, country);
  };

  public shared ({ caller }) func updateVisa(
    country : Types.VisaCountry,
    title : Text,
    description : Text,
    requirements : Text,
    processingInfo : Text,
    fees : Text,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    VisasLib.update(visas, country, title, description, requirements, processingInfo, fees);
  };
};
