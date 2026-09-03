import Auth "mo:caffeineai-oql/Auth";
import Entity "mo:caffeineai-oql/Entity";
import Executor "mo:caffeineai-oql/Executor";
import Json "mo:caffeineai-oql/Json";
import Registry "mo:caffeineai-oql/Registry";
import Schema "mo:caffeineai-oql/Schema";

mixin (config : { entities : [Entity.Decl] }) {
  transient let registry : Registry.Registry = Registry.build(config.entities);

  public shared query ({ caller }) func schema() : async Text {
    let access = func (d : Entity.Decl) : Auth.Access = Auth.resolve(d.auth, caller);
    Schema.toJson(Registry.schema(registry, access));
  };

  public shared query ({ caller }) func execute(qJson : Text) : async Executor.Result {
    let access = func (d : Entity.Decl) : Auth.Access = Auth.resolve(d.auth, caller);
    switch (Json.parseQuery(qJson)) {
      case (#err _) { { rows = []; hasMore = false } };
      case (#ok q)  { Executor.runWith(registry, q, access) };
    };
  };
};
