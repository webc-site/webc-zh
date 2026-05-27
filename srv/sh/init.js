#!/usr/bin/env bun
import workerd from "./init/workerd.js";

if (import.meta.main) await workerd();
