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
  local key_mail = keys[1]
  local key_mail_id = keys[2]
  local bin_id = get(key_mail)
  if bin_id then
    return bin_id
  end
  local id = incr(key_mail_id)
  
  bin_id = u64Bin(id)
  
  set(key_mail, bin_id)
  return bin_id
end)
