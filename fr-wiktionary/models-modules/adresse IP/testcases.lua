-- Test cases from Paul Kulchenko (https://stackoverflow.com/a/16643628/3779986)
local tests = require("Module:UnitTests")
local m_ips = require("Module:adresses IP")

local ipv4s = {
  "128.1.0.1",
  "223.255.254.254",
}
local ipv6s = {
  "1050:0:0:0:5:600:300c:326b",
  "1050:0000:0000:0000:0005:0600:300c:326b",
  "fe80:0000:0000:0000:0202:b3ff:fe1e:8329",
  "fe80:0:0:0:202:b3ff:fe1e:8329",
  "fe80::202:b3ff:fe1e:8329",
  "1050:::600:5:1000::", -- contracted
  "::",
  "::1",
}
local invalid_ips = {
  "999.12345.0.0001",
  "1050!0!0+0-5@600$300c#326b",
  "1050:0:0:0:5:600:300c:326babcdef",
  "::1::",
  "129.garbage.9.1",
  "xxx127.0.0.0",
  "xxx1050:0000:0000:0000:0005:0600:300c:326b",
  129.10 -- error
}

-- Tests --

function tests:tests_ipv4()
  for _, s in pairs(ipv4s) do
    self:equals(s, m_ips.get_ip_type(s), m_ips.IPV4)
  end
end

function tests:tests_ipv6()
  for _, s in pairs(ipv6s) do
    self:equals(s, m_ips.get_ip_type(s), m_ips.IPV6)
  end
end

function tests:tests_invalid_ips()
  for _, s in pairs(invalid_ips) do
    self:equals(s, m_ips.get_ip_type(s), nil)
  end
end

return tests
