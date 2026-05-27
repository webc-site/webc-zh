using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    ( name = "main",
      worker = (
        modules = [
          (name = "main", esModule = embed "<%= it.main %>")
        ],
        compatibilityDate = "<%= it.compatibilityDate %>",
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
      address = "*:<%= it.PORT %>",
      http = (),
      service = (name = "main")
    )
  ]
);
