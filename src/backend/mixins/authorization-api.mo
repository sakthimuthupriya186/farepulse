import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Challenges "mo:identity-attributes/Internal/Challenges";
import Verify "mo:identity-attributes/Internal/Verify";

mixin (accessControlState : AccessControl.AccessControlState) {
  transient let challenges = Challenges.empty();

  public shared func _internet_identity_sign_in_start() : async Blob {
    await Challenges.issue<system>(challenges)
  };

  public shared ({ caller }) func _internet_identity_sign_in_finish()
    : async Result.Result<(), Verify.Error>
  {
    AccessControl.initialize(accessControlState, caller);
    switch (Verify.verify<system>(challenges)) {
      case (#err(#NoAttributes)) #ok;
      case (#err e) #err e;
      case (#ok _) #ok;
    };
  };

  public shared ({ caller }) func _initialize_access_control() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    if (caller.isAnonymous()) {
      #guest
    } else {
      switch (accessControlState.userRoles.get(caller)) {
        case (?role) role;
        case null #guest;
      };
    };
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.initialize(accessControlState, caller);
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign user roles");
    };
    accessControlState.userRoles.add(user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    if (caller.isAnonymous()) {
      false
    } else {
      switch (accessControlState.userRoles.get(caller)) {
        case (?role) role == #admin;
        case null false;
      };
    };
  };
};
