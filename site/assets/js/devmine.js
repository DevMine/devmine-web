
var languages = [];
var paradigms = [];
var others = [];

$(function() {
	var i = 1;
	var resultDict = {0:{Reputation:5}};

	$.ajax({
		url: "http://localhost:8080/features/by_category",
		dataType: "json",
		async: false,
		success: function(data) {
			$.each(data['Languages'], function(i, v) {
				languages.push({id: v.name, tag: v.name});
			});
			$.each(data['Paradigms'], function(i, v) {
				paradigms.push({id: v.name, tag: v.name});
			});
			$.each(data['Others'], function(i, v) {
				others.push({id: v.name, tag: v.name});
			});
		}
	});

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

	function format(item) {
		return item.tag;
	}

	function displayTableResults(data) {
		$('#resultTable').text('');
		$('#resultTable').append('<thead><tr><th>Users</th><th>Scores</th></tr></thead><tbody>');
		$.each(data.results, function(k, v) {
			$('#resultTable').append("<tr><td>" +
							'<a href="https://github.com/'+ v.ulogin + '">' + v.ulogin +
							"</td><td>" +
							v.rank +
							"</td></tr>");
		});
		$('#resultTable').append('</tbody>');
	}

	function displayElapsedTime(data) {
		$('#time').text('');
		$('#time').append("Search time: "+ data.elapsed_time + " seconds.");
	}

	/* Languages */
	$("#drop-lang-select").select2({
		placeholder: "Select a language",
		data: {results: languages, text: 'tag' },
		formatSelection: format,
		formatResult: format,
		allowClear: true
	});
	$('button#add-lang').click({
		id1:'#drop-lang-select', id2:'#slid-ln', id3:'#tab-lang', id4:'slid-ln'
	}, addRow);
	$('button#rm-lang').click({id:'#tab-lang'}, removeRow);
	
	/* Paradigms */
	$("#drop-pdgm-select").select2({
		placeholder: "Select a Paradigm",
		data: {results: paradigms, text: 'tag' },
		formatSelection: format,
		formatResult: format,	    
		allowClear: true
	});

	$('button#add-pdgm').click({
			id1:'#drop-pdgm-select', id2:'#slid-pm', id3:'#tab-pdgm', id4:'slid-pm'
		}, addRow);
	$('button#rm-pdgm').click({id:'#tab-pdgm'}, removeRow);

	/* Options */
	$("#drop-optn-select").select2({
	    placeholder: "Select an Option",
	    data: {results: others, text: 'tag' },
		formatSelection: format,
		formatResult: format,	    
	    allowClear: true
	});
	$('button#add-optn').click({
		id1:'#drop-optn-select', id2:'#slid-op', id3:'#tab-optn', id4:'slid-op'
	}, addRow);
	$('button#rm-optn').click({id:'#tab-optn'}, removeRow);

	/* Others */
	$('#slid-ot0').slider().on('slideStop', makeSliderHandler(0, 'Reputation'));

	/* Submission */
	$('form').submit(function() {
		//$('#result').text(JSON.stringify(flattenObject(resultDict)));
		$.ajax({
			url: 'http://localhost:8080/search/' + JSON.stringify(flattenObject(resultDict)),
			dataType: 'json',
			success: function(data) {
				//$('#result').text(JSON.stringify(data));
				displayTableResults(data);
				displayElapsedTime(data);
			}
		});
		return false;
	});
});
