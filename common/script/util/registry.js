(function(){
  this.Registry = function() {
		var register = {}
		this.apply = function(name, dependencies, init) {
			if (register[name]) {
				throw new Error("Service '" + name + "' has already been registered.")
			}
			try {
				service = this.invoke(name)
				register[name] = {
					service:service
				}
			} catch(e) {
				register[name] = {
					dependencies:dependencies,
					init:init
				}
			}
		}
		var recurse = function(name, path) {
			if (!register[name]) {
				throw new Error("Service '" + name + "' does not exist.")
			}
			if (path.indexOf(name) >= 0) {
				throw new Error("Circular dependency: " + path.concat(name).join(" -> "))
			}
			service = register[name]
			if (service.service) {
				return service.service
			}
			register[name] = {
				service:service.init.apply(null, service.dependencies.map(function(dep) {
					return recurse(dep, path.concat(name))
				}))
			}
			return register[name].service
		}
		this.invoke = function(name) {
			return recurse(name, [])
		}    
  }
})()