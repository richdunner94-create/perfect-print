module {
  public type Service = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : ?Text;
    active : Bool;
    createdAt : Int;
  };
};
