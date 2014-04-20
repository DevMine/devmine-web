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

var bar = 'barbar';


function Add_row(lang_value, slider_row){
	$('#tab-lang').after('<tr><td>'+
		lang_value+
		'</td><td>'+
		slider_row+
		'</td></tr>');
};

/*
var slider_row = "<input type=\"text\" class=\"span2\""+
 									"value=\"4\" id=\"sl1\" style=\"\">"+
 									"<script>$('#sl1').slider({formater: function(value) {
											return 'Current value: '+value;
										}
									});
								</script>";
*/