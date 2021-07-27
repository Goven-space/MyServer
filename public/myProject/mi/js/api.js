$.extend({
	// 登录信息持久化方法
	getToken: function() {
		return localStorage.getItem('Token');
	},
	setToken: function( token ) {
		localStorage.setItem('Token', token);
	},
	logout: function() {
		localStorage.removeItem('Token');
		window.location.reload();
	},

	// 通用后端请求
	api: function( method, path, data, context ) {

		const HOST = 'http://vip.chanke.xyz/mi';
		return $.ajax({
			method: method,
			url: HOST + path,
			// token -》 
			headers: {
				Token: this.getToken()
			},
			// 禁用 cookie 模式
			// xhrFields: {
			// 	withCredentials: true
			// },
			data: data,
			context: context || this,
		}).then(function( data, textStatus, jqXHR ) {
			// 成功时只取有效内容
			if (!data.errorCode && data.data) {
				return data.data;
			}
		}, function( jqXHR, textStatus, errorThrown ) {
			// 通用失败处理
			let errorMsg;
			if (jqXHR.responseJSON && jqXHR.responseJSON.errorMessage) {
				errorMsg = jqXHR.responseJSON.errorMessage;
			} else {
				errorMsg = errorThrown || textStatus;
			}
			// this 即 context，可控制失败处理方式
			if (this.silent) {
				console.warn(jqXHR);
				console.warn(errorMsg);
			} else {
				// window.alert(errorMsg);
			}
			// 确保接下去依然进入 fail 分支
			return $.Deferred().reject();	// 同 return Promise.reject();
		});
	},
	apiGet: function( path ) {
		return this.api('GET', path);
	},
	apiPost: function( path, data ) {
		return this.api('POST', path, data);
	},
	getUserInfo: function() {
		if (this.getToken()) {
			return this.api('GET', '/user/getUserInfo', false, {silent: true})
				.fail(this.logout);
		} else {
			return this.Deferred().reject();
		}
	},

	// 商品详细页的前端 URL 规则
	productLink: function(pid) {
		return 'product.html?pid=' + pid;
	},
	parseProductId: function() {
		const match = location.search.match(/^\?pid=(\d+)$/);
		return match ? match[1] : false;
	},
});
