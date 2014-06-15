/**
 * ヘボン式表記のバリデーター
 */
function HebonValidator() {
	Array.prototype.contains = function(value) {
		for (var i = 0, n = this.length; i < n; i++) {
			if (this[i] === value) {
				return true;
			}
		}
		return false;
	};

	/**
	 * 通常の変換表とは異なるルールで、不正となるパターン
	 */
	invalidPatterns = [
	// 例外パターン
	"nb", "nm", "np",
	// おー、うー
	"ou", "oo", "uu" ];

	/**
	 * ひらがなとヘボン式の変換表に含まれる文字列および、頭に「っ」が入るパターン
	 */
	normalPatterns = [ "a", "i", "u", "e", "o", "ka", "ki", "ku", "ke", "ko",
			"sa", "shi", "su", "se", "so", "ta", "chi", "tsu", "te", "to",
			"na", "ni", "nu", "ne", "no", "ha", "hi", "fu", "he", "ho", "ma",
			"mi", "mu", "me", "mo", "ya", "yu", "yo", "ra", "ri", "ru", "re",
			"ro", "wa", "n", "ga", "gi", "gu", "ge", "go", "za", "ji", "zu",
			"ze", "zo", "da", "ji", "zu", "de", "do", "ba", "bi", "bu", "be",
			"bo", "pa", "pi", "pu", "pe", "po", "kya", "kyu", "kyo", "sha",
			"shu", "sho", "cha", "chu", "cho", "nya", "nyu", "nyo", "hya",
			"hyu", "hyo", "mya", "myu", "myo", "rya", "ryu", "ryo", "gya",
			"gyu", "gyo", "ja", "ju", "jo", "bya", "byu", "byo", "pya", "pyu",
			"pyo",
			// 例外パターン
			"mba", "mbi", "mbu", "mbe", "mbo", "mbya", "mbyu", "mbyo", "mpa",
			"mpi", "mpu", "mpe", "mpo", "mpya", "mpyu", "mpyo", "mma", "mmi",
			"mmu", "mme", "mmo", "mmya", "mmyu", "mmyo",
			// 「っ」パターン
			"kka", "kki", "kku", "kke", "kko", "ssa", "sshi", "ssu", "sse",
			"sso", "tta", "tchi", "ttsu", "tte", "tto", "nna", "nni", "nnu",
			"nne", "nno", "hha", "hhi", "hfu", "hhe", "hho", "mma", "mmi",
			"mmu", "mme", "mmo", "yya", "yyu", "yyo", "rra", "rri", "rru",
			"rre", "rro", "wwa", "gga", "ggi", "ggu", "gge", "ggo", "zza",
			"jji", "zzu", "zze", "zzo", "dda", "jji", "zzu", "dde", "ddo",
			"bba", "bbi", "bbu", "bbe", "bbo", "ppa", "ppi", "ppu", "ppe",
			"ppo", "kkya", "kkyu", "kkyo", "ssha", "sshu", "ssho", "tcha",
			"tchu", "tcho", "nnya", "nnyu", "nnyo", "hhya", "hhyu", "hhyo",
			"mmya", "mmyu", "mmyo", "rrya", "rryu", "rryo", "ggya", "ggyu",
			"ggyo", "jja", "jju", "jjo", "bbya", "bbyu", "bbyo", "ppya",
			"ppyu", "ppyo" ];

	/**
	 * 単語登録用
	 */
	ignoreWords = [];
}

/**
 * エラーにしない単語を追加する。
 * 
 * @param value
 *            例外に追加したい単語（カンマ区切り）
 */
HebonValidator.prototype.addIgnoreWords = function(value) {
	var words = value.split(",");
	for (var i = 0, n = words.length; i < n; i++) {
		var word = words[i];
		if (!ignoreWords.contains(word)) {
			ignoreWords.push(word);
		}
	}
};

/**
 * エラーにしないパターンを追加する。<br>
 * パターンは最大4文字まで。
 * 
 * @param value
 *            例外に追加したい文字列（カンマ区切り）
 */
HebonValidator.prototype.addIgnorePatterns = function(value) {
	var patterns = value.split(",");
	for (var i = 0, n = patterns.length; i < n; i++) {
		var pattern = patterns[i];
		if (!normalPatterns.contains(pattern)) {
			normalPatterns.push(pattern);
		}
	}
};

function getSubs(value, k) {
	return [ value.substring(k, k + 4), value.substring(k, k + 3),
			value.substring(k, k + 2), value.substring(k, k + 1) ];
}

/**
 * 通常のヘボン式変換表のパターンと一致するかどうかを判定するメソッド
 * 
 * @returns {Boolean}
 */
function isNormalPattern(value) {
	a: for (var k = 0, n = value.length; k < n;) {
		var subs = this.getSubs(value, k);

		for (var x = 0, y = subs.length; x < y; x++) {
			var sub = subs[x];
			if (normalPatterns.contains(sub)) {
				k += sub.length;
				continue a;
			}
		}

		return false;

	}

	return true;
};

/**
 * 不正なパターンを含むかを判定するメソッド
 * 
 * @returns {Boolean} 不正なパターンを含んでいる場合はtrue
 */
function hasInvalidPattern(value) {
	for (var k = 0, n = value.length - 1; k < n; k++) {
		var sub = value.substring(k, k + 2);
		if (invalidPatterns.contains(sub)) {
			return true;
		}
	}

	return false;
};

/**
 * ヘボン式のフォーマットになっているかを確認する。
 * 
 * @param {String}
 *            検査対象の文字列
 * 
 * @returns {Boolean}
 */
HebonValidator.prototype.isValid = function(value) {
	var tmp = value.split(/[ ,_-]+/);

	for (var k = 0, h = tmp.length; k < h; k++) {
		var value = tmp[k];
		if (ignoreWords.contains(value)) {
			// 単語登録されていればOK
			continue;
		}

		// if (value.search(/[^A-Za-z]+/) != -1) {
		// // 半角英字以外を無視
		// continue;
		// }

		if (value.search(/.*nn$/) != -1) {
			// 語尾がnnになっていたらNG
			return false;
		}

		if (isNormalPattern(value) && !hasInvalidPattern(value)) {
			continue;
		}

		return false;
	}

	return true;
};