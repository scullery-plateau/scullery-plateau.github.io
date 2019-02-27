(function(){
	var publish = function(log) {
		log = JSON.parse(log);
		var errorMap = {};
		log.testLog = log.testLog.map(function(test) {
			return test.join(" - ")
		});
		log.errorLog.forEach(function(error){
			var path = error.path.join(" - ");
			if (log.testLog.indexOf(path) < 0) {
				log.testLog.push(path);
			}
			errorMap[path] = error.error;
		});
		return log.testLog.map(function(path) {
			if (path in errorMap) {
				var error = errorMap[path];
				var stack = [];
				if (error.stack) {
					stack = "<ul>" + error.stack.map(function(step) {
						return "<li>" + step + "</li>";
					}).join("") + "</ul>";
				}
				return [].concat([
				"<li class=\"fail\">",
					path,
					"<ul><li>",
					error.message,
					],stack,[
					"</li></ul>",
				"</li>"
				]).join("");
			} else {
				return "<li class=\"success\">" +path+ "</li>";
			}
		}).join("");
	}
	this.logger = {};
	this.TestRunner = function() {
		var logs = [];
		this.init = function() {
			logger.log = function(body) {
				logs.push(body);
			}
		}
		this.showTests = function() {
			return logs.map(publish).join("");
		}
	}
})()