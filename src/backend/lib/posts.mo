import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/posts";

module {
  public func listPublished(posts : Map.Map<Nat, Types.Post>) : [Types.Post] {
    posts.values().filter(func p = p.published).toArray();
  };

  public func listAll(posts : Map.Map<Nat, Types.Post>) : [Types.Post] {
    posts.values().toArray();
  };

  public func get(posts : Map.Map<Nat, Types.Post>, id : Nat) : ?Types.Post {
    posts.get(id);
  };

  public func create(
    posts : Map.Map<Nat, Types.Post>,
    state : { var nextPostId : Nat },
    title : Text,
    body : Text,
    imageUrl : ?Text,
    category : Types.PostCategory,
    published : Bool,
  ) : Nat {
    let id = state.nextPostId;
    state.nextPostId := id + 1;
    posts.add(id, {
      id;
      title;
      body;
      imageUrl;
      category;
      published;
      createdAt = Time.now();
    });
    id;
  };

  public func update(
    posts : Map.Map<Nat, Types.Post>,
    id : Nat,
    title : Text,
    body : Text,
    imageUrl : ?Text,
    category : Types.PostCategory,
    published : Bool,
  ) : Bool {
    switch (posts.get(id)) {
      case (?existing) {
        posts.add(id, {
          id;
          title;
          body;
          imageUrl;
          category;
          published;
          createdAt = existing.createdAt;
        });
        true;
      };
      case null { false };
    };
  };

  public func remove(posts : Map.Map<Nat, Types.Post>, id : Nat) : Bool {
    switch (posts.get(id)) {
      case (?_) { posts.remove(id); true };
      case null { false };
    };
  };
};
