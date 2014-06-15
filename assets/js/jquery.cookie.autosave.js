/*!  */
/* 入力欄の値をクッキーで自動保存するjQueryプラグイン.
 * jquery.cookie必須。
 * 
 * jQuery: 2.1.1
 * jquery.cookie v1.4.1
 */
(function($) {
	var defaults = {
		'expires' : 90,
		'path' : '/',
	};
	var setting;

	$.fn.cookieAutosave = function(options){
		setting = $.extend(defaults, options);

		this.each(function(){
			var tag = $(this).get(0).tagName.toLowerCase();
			var type = $(this).attr('type');

			var name = $(this).prop('name');
			var lastSavedValue = $.cookie(name);
			if(tag == 'input' && type == 'checkbox'){
				if(lastSavedValue !== undefined){
					$(this).prop('checked', lastSavedValue == 'true' ? true : false);
				}
				$(this).on('change', function(){
					var checked = $(this).prop('checked');
					$.cookie(name, checked ? 'true' : 'false');
				});
			}else if(tag == 'input' && type == 'radio'){
				if(lastSavedValue !== undefined){
					$(this).prop('checked', $(this).val() == lastSavedValue ? true : false);
				}
				$(this).on('change', function(){
					var checkedValue = $(this).val();
					$.cookie(name, checkedValue);
				});
			}else if(tag == 'input' && type == 'text'){
				if(lastSavedValue !== undefined){
					$(this).val(lastSavedValue);
				}
				$(this).on('change', function(){
					var text = $(this).val();
					$.cookie(name, text);
				});
			}else if(tag == 'textarea'){
				if(lastSavedValue !== undefined){
					$(this).val(lastSavedValue);
				}
				$(this).on('change', function(){
					var text = $(this).val();
					$.cookie(name, text);
				});
			}else if(tag == 'select'){
				if(lastSavedValue !== undefined){
					$(this).val(lastSavedValue);
				}
				$(this).on('change', function(){
					var selected = $(this).val();
					$.cookie(name, selected);
				});
			}
		});

		return this;
	}
})(jQuery);