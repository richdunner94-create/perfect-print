import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import PostsLib "../lib/posts";
import Types "../types/posts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  posts : Map.Map<Nat, Types.Post>,
  state : { var nextPostId : Nat },
) {
  public query ({ caller }) func listPosts() : async [Types.Post] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      PostsLib.listAll(posts);
    } else {
      PostsLib.listPublished(posts);
    };
  };

  public query func getPost(id : Nat) : async ?Types.Post {
    PostsLib.get(posts, id);
  };

  public shared ({ caller }) func createPost(
    title : Text,
    body : Text,
    imageUrl : ?Text,
    category : Types.PostCategory,
    published : Bool,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    PostsLib.create(posts, state, title, body, imageUrl, category, published);
  };

  public shared ({ caller }) func updatePost(
    id : Nat,
    title : Text,
    body : Text,
    imageUrl : ?Text,
    category : Types.PostCategory,
    published : Bool,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    PostsLib.update(posts, id, title, body, imageUrl, category, published);
  };

  public shared ({ caller }) func deletePost(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    PostsLib.remove(posts, id);
  };
};
