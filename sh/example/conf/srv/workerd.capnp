using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    ( name = "main",
      worker = (
        modules = [
          (name = "main", esModule = embed "../dist/main.js")
        ],
        compatibilityDate = "2026-05-26",
        compatibilityFlags = ["nodejs_compat", "experimental"],
        bindings = [
          (name = "loader", workerLoader = ()),
        ],
        globalOutbound = "internet",
      )
    ),
    ( name = "internet", network = ( allow = ["private", "public"] ) )
  ],
  sockets = [
    ( name = "http",
      address = "*:9050",
      http = (),
      service = (name = "main")
    )
  ]
);
