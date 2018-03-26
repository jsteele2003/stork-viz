		// build scene
		// var scene = new ScrollMagic.Scene({
		// 					triggerElement: "#trigger1", duration: "100%"
		// 				})
		// 				.setPin('#intro')
		// 				.addTo(controller);
						
		$(function (){
		var scene1 = new ScrollMagic.Scene({
							triggerElement: "#trigger1", duration: "100%"
						})
						.setTween("#animate1", 1, {scale: 1.3, repeat: 5, yoyo: true})
						.setPin('#animate1')
						.addTo(controller);
		
	  var scene2 = new ScrollMagic.Scene({
	        triggerElement: "#trigger2",
						})
						.setTween("#animate2", {backgroundColor: "#252525"})
						.addTo(controller);
		
		})