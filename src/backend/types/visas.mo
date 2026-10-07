import Order "mo:core/Order";

module {
  public type VisaCountry = {
    #china;
    #france;
    #usa;
  };

  public func compare(a : VisaCountry, b : VisaCountry) : Order.Order {
    switch (a, b) {
      case (#china, #china) { #equal };
      case (#france, #france) { #equal };
      case (#usa, #usa) { #equal };
      case (#china, _) { #less };
      case (#france, #usa) { #less };
      case (#france, _) { #greater };
      case (#usa, _) { #greater };
    };
  };

  public type VisaDetails = {
    country : VisaCountry;
    title : Text;
    description : Text;
    requirements : Text;
    processingInfo : Text;
    fees : Text;
  };
};
