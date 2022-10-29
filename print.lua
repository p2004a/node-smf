mapinfo = require "mapinfo"
json = require "json"

io.write(json.encode({
	name = mapinfo.name,
	version = mapinfo.version,
}))
