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

redis.register_function('mailId', function(keys, args)
  local prefix = args[1]
  local host = args[2]
  local key_mail = "{mail}:" .. host .. ":" .. prefix
  local bin_id = get(key_mail)
  if bin_id then
    return bin_id
  end
  local id = incr('{mail}Id')
  
  bin_id = u64Bin(id)
  
  set(key_mail, bin_id)
  set('id{mail}:' .. bin_id, prefix .. '@' .. host)
  return bin_id
end)
