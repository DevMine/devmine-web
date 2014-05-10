var languages = new Array();
languages[0] = "Java";
languages[1] = "Python";
languages[2] = "C++";
languages[3] = "Haskell";
languages[4] = "Objectice-C";
languages[5] = "Go";
languages[6] = "Scala";
languages[7] = "Javascript";

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

		if (!($spinValue in flattenObject(resultDict))) {
			sliderScript.text = "$('"+sliderId+i+"').slider({tooltip:'hide'});";
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
	}

	function removeRow(e) {
		$(e.data.id).each(function() {
			//console.info(e.data.id);
			if ($('tbody', this).length > 0) {
				delete resultDict[$('tbody tr:last', this).attr('id')];
				$('tbody tr:last', this).remove();
			} else {
				delete resultDict[$('tr:last', this).attr('id')];
				$('tr:last', this).remove();
			}
		});
	}

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
	$("#drop-lang-select").select2({
	    placeholder: "Select a Language",
	    allowClear: true
	});
	$('button#add-lang').click({
		id1:'#drop-lang-select', id2:'#slid-ln', id3:'#tab-lang', id4:'slid-ln'
	}, addRow);
	$('button#rm-lang').click({id:'#tab-lang'}, removeRow);
	
	/* paradigms */
	$("#drop-pdgm-select").select2({
	    placeholder: "Select a Paradigm",
	    allowClear: true
	});

	$('button#add-pdgm').click({
			id1:'#drop-pdgm-select', id2:'#slid-pm', id3:'#tab-pdgm', id4:'slid-pm'
		}, addRow);
	$('button#rm-pdgm').click({id:'#tab-pdgm'}, removeRow);

	/* options */
	$("#drop-optn-select").select2({
	    placeholder: "Select an Option",
	    allowClear: true
	});
	$('button#add-optn').click({
		id1:'#drop-optn-select', id2:'#slid-op', id3:'#tab-optn', id4:'slid-op'
	}, addRow);
	$('button#rm-optn').click({id:'#tab-optn'}, removeRow);

	/* submit */
	$('form').submit(function() {
		$('#result').text(JSON.stringify(flattenObject(resultDict)));
		return false;
	});

});





