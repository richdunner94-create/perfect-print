module {
  public type PostCategory = {
    #promotion;
    #announcement;
    #advertising;
  };

  public type Post = {
    id : Nat;
    title : Text;
    body : Text;
    imageUrl : ?Text;
    category : PostCategory;
    published : Bool;
    createdAt : Int;
  };
};
