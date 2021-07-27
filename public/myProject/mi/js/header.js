$(function() {
	const tpl = $(`
		<div class="topbar">
			<div class="container">
				<div class="topbar-nav">
					<a href="">小米商城</a><span>|</span>
					<a href="">MIUI</a><span>|</span>
					<a href="">IoT</a><span>|</span>
					<a href="">云服务</a><span>|</span>
					<a href="">金融</a><span>|</span>
					<a href="">有品</a><span>|</span>
					<a href="">小爱开放平台</a><span>|</span>
					<a href="">政企服务</a><span>|</span>
					<a href="">Select Region</a>
				</div>
				<div class="topbar-cart logined" style="display: none">
				<a href="cart.html"><i class="iconfont">&#xe60c;</i>购物车<span>（<label class="count">0</label>）</span></a>
				</div>
				<div class="topbar-info clearfix">
					<a href="serviceLogin.html" class="not-logined">登录</a><span class="not-logined">|</span>
					<a href="serviceLogin.html?tab=register" class="not-logined">注册</a><span class="not-logined">|</span>
					<a class="logined username"></a><span class="logined">|</span>
					<a class="sep">消息通知</a>
					<a href="#" class="sep logined logout" style="display: none">登出</a>
				</div>
			</div>
		</div>

		<div class="header">
			<div class="container">
				<div class="header-logo">
					<a href="#" class="lr">小米官网</a>
				</div>
				<div class="header-nav">
					<ul class="nav-list clearfix">
						<li class="nav-category">
							<a href="javascript:;">全部商品分类</a>
							<div class="category-list">
								<ul>
									<li class="tpl-cat">
										<a class="title">
											<span></span>
											<i class="iconfont"></i>
										</a>
										<div class="children clearfix">
											<ul class="children-list">
												<li class="tpl-children">
													<a href="#">
														<img src="" alt="" />
														<span class="text"></span>
													</a>
												</li>
											</ul>
										</div>
									</li>
								</ul>
							</div>
						</li>
						<li class="nav-item tpl-nav">
							<a></a>
						</li>
					</ul>
				</div>
				<div class="header-search">
					<form action="" class="search-form">
						<input type="search" name="keyword" class="search-text">
						<input type="submit" value="&#xe616;" class="search-btn iconfont">
					</form>
				</div>
			</div>
		</div>
	`);

	const catUl = tpl.find('.category-list ul');
	const childTpl = tpl.find('.tpl-children').remove();	// 先提取子模板，并删除
	const catTpl = tpl.find('.tpl-cat').remove();	// 再提取父模板，并删除

	const navUl = tpl.find('.nav-list');
	const navTpl = tpl.find('.tpl-nav').remove();

	// 剔除模板后即可插入到页面占位
	$('body').prepend(tpl);

	// 请求成功再异步填充内容
	$.apiGet('/menu?type=left').done(function(result) {
		let catClone, childrenUl, childClone;
		for (const cat of result) {
			catClone = catTpl.clone();
			catClone.children('a').find('span').text(cat.name);
			if (cat.url) {
				catClone.children('a').attr('href', cat.url);
			}
			if (cat.list) {
				childrenUl = catClone.find('.children-list');
				for (const item of cat.list) {
					childClone = childTpl.clone();
					childClone.find('.text').text(item.name);
					childClone.find('a').attr('href', $.productLink(item.pid));
					childClone.find('img').attr('src', item.img);
					childrenUl.append(childClone);
				}
			} else {
				catClone.find('.children').remove();
			}
			catUl.append(catClone);
		}
	});

	$.apiGet('/menu?type=top').done(function(result) {
		let navClone;
		for (const menu of result) {
			navClone = navTpl.clone();
			navClone.find('a').attr('href', menu.url).text(menu.name);
			navUl.append(navClone);
		}
	});

	$.getUserInfo().then(function(user) {
		$('.topbar .not-logined').hide();
		$('.topbar .logined').show().filter('.username').text(user.name);
		$('.logout').on('click', function() {
			$.logout();
		});

		// 加载购物车内容
		$.apiGet('/user/cart').done(function(result) {
			$('.topbar-cart .count').text(result.reduce((sum, item) => sum + +item.quantity, 0));
			console.log(result);
			// TODO: 渲染
		})
	}, function() {
		$('.topbar .logined').hide();
		$('.topbar .not-logined').show();
	});
});