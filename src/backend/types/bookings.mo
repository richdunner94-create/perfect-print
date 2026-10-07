module {
  public type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  public type Booking = {
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
};
