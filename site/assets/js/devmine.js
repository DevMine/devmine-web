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

	function add_slider(e) {
		var $spin_value = $(e.data.id1).val();
		if ($spin_value == '') {
			alert('nothing selected');
			return;
		}
		var slider_id = e.data.id2;
		var $table_id = $(e.data.id3);
		var input_id = e.data.id4;
		var slider = document.createElement('script');
		slider.text = "$('"+slider_id+i+"').slider({tooltip:'show'});";
		$table_id.append('<tr><td class="feat-left">'+
											$spin_value+
											'</td><td class="slid-right" id="sl'+i+'">'+
											'<input type="text" class="span2" value="4" id="'+
											input_id+i+
											'" style="">'+
											'</td></tr>');
		$('#sl'+i+'')[0].appendChild(slider);
		i++;
	}

	function remove_slider(e) {
		$(e.data.id).each(function() {
    	if ($('tbody', this).length > 0) {
        $('tbody tr:last', this).remove();
			} else {
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

	var i = 0;

	/* languages */
	$("input[name=languages]").TouchSpin({
		items: languages
	});
	$('button#add-lang').click({
		id1:'#spin-lang', id2:'#slid-ln', id3:'#tab-lang', id4:'slid-ln'
	}, add_slider);
	$('button#rm-lang').click({id:'#tab-lang'}, remove_slider);
	
	/* paradigms */
	$("input[name=paradigms]").TouchSpin({
		items: paradigms
	});
	$('button#add-pdgm').click({
			id1:'#spin-pdgm', id2:'#slid-pm', id3:'#tab-pdgm', id4:'slid-pm'
		}, add_slider);
	$('button#rm-pdgm').click({id:'#tab-pdgm'}, remove_slider);

	/* options */
	$("input[name=options]").TouchSpin({
		items: options
	});
	$('button#add-optn').click({
		id1:'#spin-optn', id2:'#slid-op', id3:'#tab-optn', id4:'slid-op'
	}, add_slider);
	$('button#rm-optn').click({id:'#tab-optn'}, remove_slider);

	/* submit */
	$('form').submit(function() {
  	$('#result').text(JSON.stringify($('form').serializeObject()));
			return false;
	});

});






