import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Service = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : ?Text;
    active : Bool;
    createdAt : Int;
  };

  type PostCategory = { #promotion; #announcement; #advertising };

  type Post = {
    id : Nat;
    title : Text;
    body : Text;
    imageUrl : ?Text;
    category : PostCategory;
    published : Bool;
    createdAt : Int;
  };

  type VisaCountry = { #china; #france; #usa };

  module VisaCountry {
    public func compare(a : VisaCountry, b : VisaCountry) : { #less; #equal; #greater } {
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
  };

  type VisaDetails = {
    country : VisaCountry;
    title : Text;
    description : Text;
    requirements : Text;
    processingInfo : Text;
    fees : Text;
  };

  type BookingStatus = { #pending; #confirmed; #completed; #cancelled };

  type Booking = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    serviceType : Text;
    preferredDate : Text;
    preferredTime : Text;
    notes : Text;
    status : BookingStatus;
    createdAt : Int;
  };

  type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
  };

  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    services : Map.Map<Nat, Service>;
    posts : Map.Map<Nat, Post>;
    visas : Map.Map<VisaCountry, VisaDetails>;
    bookings : Map.Map<Nat, Booking>;
    contactMessages : Map.Map<Nat, ContactMessage>;
    counters : {
      var nextServiceId : Nat;
      var nextPostId : Nat;
      var nextBookingId : Nat;
      var nextContactMessageId : Nat;
    };
  };

  public func migration(_ : OldActor) : NewActor {
    let visas = Map.empty<VisaCountry, VisaDetails>();
    visas.add(#china, {
      country = #china;
      title = "China Visa Assistance";
      description = "We help you prepare and submit a complete China visa application, including tourist, business, and transit visas.";
      requirements = "Valid passport (6+ months validity), completed application form, recent passport photos, flight and hotel bookings, proof of funds, and travel itinerary.";
      processingInfo = "Standard processing takes 5-10 business days. Express options may be available depending on the consulate.";
      fees = "Service fee from 25,000 XAF plus consular fees. Final cost depends on visa type and processing speed.";
    });
    visas.add(#france, {
      country = #france;
      title = "France Visa Assistance";
      description = "Support for Schengen (France) short-stay and long-stay visa applications, from document review to appointment booking.";
      requirements = "Valid passport, completed Schengen application form, passport photos, travel medical insurance, proof of accommodation, flight reservation, and bank statements.";
      processingInfo = "Schengen visa decisions are typically issued within 15 calendar days, and can take longer during peak season.";
      fees = "Service fee from 30,000 XAF plus the consular fee. Final cost depends on visa type and processing speed.";
    });
    visas.add(#usa, {
      country = #usa;
      title = "USA Visa Assistance";
      description = "Guidance for US non-immigrant visa applications (B1/B2 tourist and business), including DS-160 form help and interview preparation.";
      requirements = "Valid passport, completed DS-160 form, passport photo, visa fee payment receipt, and supporting documents showing ties to your home country.";
      processingInfo = "Interview wait times vary by consulate. We help you book the earliest available appointment and prepare your documents.";
      fees = "Service fee from 35,000 XAF plus the US visa application fee. Final cost depends on visa type.";
    });
    {
      accessControlState = AccessControl.initState();
      services = Map.empty();
      posts = Map.empty();
      visas;
      bookings = Map.empty();
      contactMessages = Map.empty();
      counters = {
        var nextServiceId = 0;
        var nextPostId = 0;
        var nextBookingId = 0;
        var nextContactMessageId = 0;
      };
    };
  };
};
