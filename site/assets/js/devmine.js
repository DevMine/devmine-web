
var languages = [];
var paradigms = [];
var others = [];

$(function() {
	var i = 2;
	var resultDict = {0:{Reputation:5},1:{Followers:5}};
	var urlAPI = "http://api-devmine.wlabs.ch:8080";

	$.ajax({
		url: urlAPI + "/features/by_category",
		dataType: "json",
		async: false,
		success: function(data) {
			if (data['Languages'] !== undefined) {
				$.each(data['Languages'], function(i, v) {
					languages.push({id: v.name, tag: v.name});
				});
			}
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
			$tableId.append(
					'<tr id="'+i+
					'"><td class="feat-left">'+
					$spinValue+
					'</td><td class="slid-right" id="sl'+i+'">'+
					'<input type="text" class="span2" value="4" id="'+
					inputId+i+
					'" style="">'+
					'</td></tr>'
					);
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
        $('#spinner').removeClass('spinner').empty();
		$('#resultTable').text('');
		$('#resultTable').append('<thead><tr><th>Users</th><th>Scores</th></tr></thead><tbody>');
		$.each(data.results, function(k, v) {
			$('#resultTable').append(
							"<tr><td>" +
							'<a href="https://github.com/'+
							v.ulogin + '">' +
							v.ulogin +
							"</td><td>" +
							v.rank +
							"</td></tr>"
							);
		});
		$('#resultTable').append('</tbody>');
	}

	function displayElapsedTime(data) {
		$('#time').text("Elapsed time: "+ data.elapsed_time + " seconds.");
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
		id1:'#drop-lang-select',
		id2:'#slid-ln',
		id3:'#tab-lang',
		id4:'slid-ln'
		}, addRow);
	$('button#rm-lang').click({id:'#tab-lang'}, removeRow);

	/* Others */
	$('#slid-ot1').slider().on('slideStop', makeSliderHandler(1, 'Followers'));
	$('#slid-ot0').slider().on('slideStop', makeSliderHandler(0, 'Reputation'));

	/* Submission */
	$('form').submit(function() {
		//$('#result').text(JSON.stringify(flattenObject(resultDict)));
		$('#time').text('');
		$('#spinner').addClass('spinner').append('<div>Loading</div>');
		$('#resultTable').empty();
		$.ajax({
			url: urlAPI + '/search/' + JSON.stringify(flattenObject(resultDict)),
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
