$(function() {
	var m = frzr.el
	var Table = function(data) {
		this.el = m("div", null,
			m("table", { class: "table table-striped latest-data" },
				m("tbody",
					this.rows = new frzr.List(Row)
				)
			)
		);
		this.update()
	}
	Table.prototype.update = function() {
		data = ENV.generateData().toArray()

		Monitoring.renderRate.ping()

		this.rows.update(data)

		setTimeout(() => this.update(), ENV.timeout)
	}

	var Row = function() {
		var cells = [
			this.db = m("td", { class: "dbname" }),
			m("td", { class: "query-count" },
				this.count = m("span")
			)
		].concat(
			this.topFive = [0,1,2,3,4].map(function() {
				return m("td",
					m("span"),
					m("div", { class: "popover left" },
						m("div", { class: "popover-content" }),
						m("div", { class: "arrow" }, "")
					)
				);
			})
		)
		this.el = m('tr');
		frzr.setChildren(this.el, cells);
	}
	Row.prototype.update = function(db) {
		this.el.key = db.dbname
		this.db.textContent = db.dbname
		this.count.className = db.lastSample.countClassName
		this.count.textContent = db.lastSample.nbQueries
		this.topFive.forEach(function(el, i) {
			var query = db.lastSample.topFiveQueries[i]

			var td = el
			td.className = "Query " + query.elapsedClassName

			var span = td.firstChild
			span.textContent = query.formatElapsed

			var popover = span.nextSibling.firstChild.textContent = query.query
		})
	}

	var data = ENV.generateData().toArray()
	var table = new Table(data)
	frzr.mount(document.getElementById("app"), table);
});
