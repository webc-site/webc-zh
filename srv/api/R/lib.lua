local function u64Bin(id)
  local bytes = {}
  for i = 8, 1, -1 do
    bytes[i] = string.char(id % 256)
    id = math.floor(id / 256)
  end
  return table.concat(bytes)
end

local function get(k)
  return redis.call('get', k)
end

local function set(k, v)
  redis.call('set', k, v)
end

local function incr(k)
  return redis.call('incr', k)
end

local function getOrIncrId(key, key_id)
  local bin_id = get(key)
  if bin_id then
    return bin_id
  end
  local id = incr(key_id)
  bin_id = u64Bin(id)
  set(key, bin_id)
  return bin_id
end
