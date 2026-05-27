#!/usr/bin/env bun
import workerd from "~/srv/sh/init/workerd.js";

if (import.meta.main) await workerd();
