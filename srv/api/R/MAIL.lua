redis.register_function('mailId', function(keys, args)
  return getOrIncrId(keys[1], keys[2])
end)

