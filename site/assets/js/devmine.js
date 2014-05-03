var languages = new Array();
languages[0] = "Java";
languages[1] = "Python";
languages[2] = "C++";
languages[3] = "Haskell";

var paradigms = new Array();
paradigms[0] = "OOP";
paradigms[1] = "Functional";
paradigms[2] = "Symbolic";
paradigms[3] = "Logic";
paradigms[4] = "Imperative";
paradigms[5] = "Declarative";
	
var options = new Array();
options[0] = "option 1";
options[1] = "option 2";
options[2] = "option 3";




$(function() {
	var i = 0;
	var resultDict = {};

	function makeSliderHandler(idx, spinValue) {
		return function(ev) {
			var $sliderValue = ev.value;
			resultDict[''+idx][spinValue] = $sliderValue;
		};
	}

	function addRow(e) {
		var $spinValue = $(e.data.id1).val();
		if ($spinValue == '') {
			alert('Nothing selected!');
			return;
		}
		var sliderId = e.data.id2;
		var $tableId = $(e.data.id3);
		var inputId = e.data.id4;
		var sliderScript = document.createElement('script');
		var rowDict = {};
		
		sliderScript.text = "$('"+sliderId+i+"').slider({tooltip:'show'});";
		$tableId.append('<tr id="'+i+'"><td class="feat-left">'+
											$spinValue+
											'</td><td class="slid-right" id="sl'+i+'">'+
											'<input type="text" class="span2" value="4" id="'+
											inputId+i+
											'" style="">'+
											'</td></tr>');
		$('#sl'+i+'')[0].appendChild(sliderScript);

		rowDict[$spinValue] = 5;
		resultDict[''+i] = rowDict;

		$(''+sliderId+i).slider().on('slideStop', makeSliderHandler(i, $spinValue));

		i++;
	}

	function removeRow(e) {
		$(e.data.id).each(function() {
			if ($('tbody', this).length > 0) {
				delete resultDict[$('tr:last').attr('id')];
				$('tbody tr:last', this).remove();
			} else {
				delete resultDict[$('tr:last').attr('id')];
				$('tr:last', this).remove();
			}
		});
	}

	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	function flattenObject(ob) {
		var toReturn = {};

		for (var i in ob) {
			if (!ob.hasOwnProperty(i)) continue;

			if ((typeof ob[i]) == 'object') {
				var flatObject = flattenObject(ob[i]);
				for (var x in flatObject) {
					if (!flatObject.hasOwnProperty(x)) continue;

					toReturn[x] = flatObject[x];
				}
			} else {
				toReturn[i] = ob[i];
			}
		}
		return toReturn;
	}

	/* languages */
	$("input[name=languages]").TouchSpin({
		items: languages
	});
	$('button#add-lang').click({
		id1:'#spin-lang', id2:'#slid-ln', id3:'#tab-lang', id4:'slid-ln'
	}, addRow);
	$('button#rm-lang').click({id:'#tab-lang'}, removeRow);
	
	/* paradigms */
	$("input[name=paradigms]").TouchSpin({
		items: paradigms
	});
	$('button#add-pdgm').click({
			id1:'#spin-pdgm', id2:'#slid-pm', id3:'#tab-pdgm', id4:'slid-pm'
		}, addRow);
	$('button#rm-pdgm').click({id:'#tab-pdgm'}, removeRow);

	/* options */
	$("input[name=options]").TouchSpin({
		items: options
	});
	$('button#add-optn').click({
		id1:'#spin-optn', id2:'#slid-op', id3:'#tab-optn', id4:'slid-op'
	}, addRow);
	$('button#rm-optn').click({id:'#tab-optn'}, removeRow);

	/* submit */
	$('form').submit(function() {
		$('#result').text(JSON.stringify(flattenObject(resultDict)));
		return false;
	});


});





