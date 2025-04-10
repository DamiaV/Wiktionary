local m_params = require('Module:paramètres')

local p = {}

p.IPV4 = 'IPv4'
p.IPV6 = 'IPv6'

--- Check what type of IP address the given string is.
--- @param ip string The IP to check.
--- @return string|nil Either 'IPv4', 'IPv6', or `nil` if the argument is not a valid IP address.
--- @author Paul Kulchenko (https://stackoverflow.com/a/16643628/3779986)
function p.get_ip_type(ip)
  if type(ip) ~= "string" then
    return nil
  end

  -- Check for format 1.11.111.111 for IPv4
  local ipv4_chunks = { ip:match("^(%d+)%.(%d+)%.(%d+)%.(%d+)$") }
  if #ipv4_chunks == 4 then
    for _, v in pairs(ipv4_chunks) do
      if tonumber(v) > 255 then
        return nil
      end
    end
    return p.IPV4
  end

  -- Check for IPv6 format, should be 8 'chunks' of numbers/letters
  -- without leading/trailing chars
  -- or fewer than 8 chunks, but with only one '::' group
  local ipv6_chunks = { ip:match("^" .. (("([a-fA-F0-9]*):"):rep(8):gsub(":$", "$"))) }
  if #ipv6_chunks == 8
      or #ipv6_chunks < 8 and ip:match('::')
      -- No more than 1 '::' group
      and not ip:gsub("::", "", 1):match('::') then
    for _, v in pairs(ipv6_chunks) do
      if #v > 0 and tonumber(v, 16) > 65535 then
        return nil
      end
    end
    return p.IPV6
  end

  return nil
end

--- This function indicates whether the passed value is a valid IP address.
--- Parameters:
---  frame.args[1]: The string to check.
--- @return string Either 'yes' if the argument is a valid IP address, or an empty string otherwise.
function p.is_ip_address(frame)
  local args = m_params.process(frame.args, {
    [1] = { required = true },
  })
  return p.get_ip_type(args[1]) ~= nil and 'yes' or ''
end

return p
