import Map "mo:core/Map";
import Types "../types/visas";

module {
  public func list(visas : Map.Map<Types.VisaCountry, Types.VisaDetails>) : [Types.VisaDetails] {
    visas.values().toArray();
  };

  public func get(
    visas : Map.Map<Types.VisaCountry, Types.VisaDetails>,
    country : Types.VisaCountry,
  ) : ?Types.VisaDetails {
    visas.get(country);
  };

  public func update(
    visas : Map.Map<Types.VisaCountry, Types.VisaDetails>,
    country : Types.VisaCountry,
    title : Text,
    description : Text,
    requirements : Text,
    processingInfo : Text,
    fees : Text,
  ) : Bool {
    switch (visas.get(country)) {
      case (?_) {
        visas.add(country, {
          country;
          title;
          description;
          requirements;
          processingInfo;
          fees;
        });
        true;
      };
      case null { false };
    };
  };
};
