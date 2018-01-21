(function() {

	//Menu
	$( '#dl-menu' ).dlmenu();


	$('#download').on('click', function(){
        
        var emplcode = localStorage.getItem('emplcode');
        var code = '2392';

        var infopdf;

        if (emplcode) {
            code = emplcode;
            //alert(code);
        }

       window.location.href="pdf.php?data="+code;


    });
	

    //responsive carousel

    $('.responsive').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 4,
		slidesToScroll: 4,
		autoplay: false,
		autoplaySpeed: 2000,
		responsive: [


		{
			breakpoint: 769,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		}
		
		]
	});


	if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	[].slice.call( document.querySelectorAll( 'input.input_field' ) ).forEach( function( inputEl ) {
		// in case the input is already filled..
		if( inputEl.value.trim() !== '' ) {
			classie.add( inputEl.parentNode, 'input_filled' );
		}

		// events:
		inputEl.addEventListener( 'focus', onInputFocus );
		inputEl.addEventListener( 'blur', onInputBlur );
	} );

	function onInputFocus( ev ) {
		classie.add( ev.target.parentNode, 'input_filled' );
	}

	function onInputBlur( ev ) {
		if( ev.target.value.trim() === '' ) {
			classie.remove( ev.target.parentNode, 'input_filled' );
		}
	}


	//form
	$( "#employeeform" ).submit(function( event ) {

		event.preventDefault();
		$('#overlay').show();

		var str = $( "form" ).serialize();
		var canContinue = true;

		if(document.getElementById("BEGDA").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: Fecha de contrataci\u00F3n es requerido", "error");
		}else if(document.getElementById("NACHN").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: Primer Apellido es requerido", "error");
		}else if(document.getElementById("VORNA").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: Primer Nombre requerido", "error");
		}else if(document.getElementById("GBDAT").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: Fecha de nacimiento es requerida", "error");
		}else if(document.getElementById("GESCH").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: G\u00E9nero es requerido", "error");
		}else if(document.getElementById("BETRG").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: Sueldo es requerido", "error");
		}else if(document.getElementById("ICNUM").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: C\u00E9dula es requerido", "error");
		}else if(document.getElementById("USRID").value ==''){
			canContinue = false;
			sweetAlert("", "El campo: Correo Electr\u00F3nico requerido", "error");
		}
		


		//alert(str);

		if (canContinue) {
			

			localStorage.clear();

			var name = document.getElementById('VORNA').value + " " + document.getElementById('NAME2').value + " " + document.getElementById('NACHN').value + " " + document.getElementById('NACH2').value;

			var id = document.getElementById('ICNUM').value;

			var salary = document.getElementById('BETRG').value;


			//console.log(name + " id " + id + " sal " + salary);

			localStorage.setItem('name', name);
			localStorage.setItem('nid', id);
			localStorage.setItem('salary', salary);

			$.ajax({
			    //Employee creation
			    url: "p.php?url="+escape("http://190.242.124.172:8000/sap/bc/zih_sv_contrata?sap-client=111&OPERATION=CONTR"),
			    type: "POST",
			    data: str,
			    success: function(result){

			    	var empl_code = result.replace(/\D/g, '');
			    	//console.log('code' + empl_code);
			    	localStorage.setItem('emplcode', empl_code);

			      //Liquidacion de Nomina
			      paying(empl_code);

			      

			  },
			  error: function(e){
			  	sweetAlert("Error", "intente nuevamente", "error");
			  	
			  }
			});
		}

	});

	


})();

function employeeInfo(){
	//console.log("here");
	var emplcode = localStorage.getItem('emplcode');
	if (emplcode) {
		//console.log("the code is created: " + emplcode);

		$('#emp_name').html(localStorage.getItem('name'));
		$('#emp_id').html(localStorage.getItem('nid'));
		$('#emp_sal').html(localStorage.getItem('salary'));
	}
    			
}

function paying( code ){

	  var empl_code = {PERNR: code};

	  $.ajax({
	  //Employee creation
		url: "p.php?url="+escape("http://190.242.124.172:8000/sap/bc/zih_sv_contrata?sap-client=111&OPERATION=LIQNM&sap-language=ES"),
		type: "POST",
		data: empl_code,
		success: function(result){
			//alert(result);
			sweetAlert("", result, "success");
			localStorage.setItem('flag', "1");
			$("#employeeform")[0].reset();
			$('#overlay').hide();
		},
		error: function(e){
			
			sweetAlert("", e, "error");
	  	}
	  });

	  
}

